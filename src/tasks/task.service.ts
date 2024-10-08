import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EmailService } from '../email/email.service';
import axios from 'axios';
import { CampaignService } from 'src/campaigns/campaigns.service';
import { SubscriberService } from 'src/subscribers/subscribers.service';
import { ClickStatService } from 'src/click_stats/click_stats.service';

@Injectable()
export class TasksService {
    constructor(
        private readonly mailService: EmailService,
        private readonly campaignService: CampaignService,
        private readonly subscriberService: SubscriberService,
        private readonly clickStatService: ClickStatService
        
    ) { }
    private readonly logger = new Logger(TasksService.name);

    @Cron('0 2 * * *')
    async handleCron() {
        const { RSS_FEED_URL : rssFeedUrl, FEED_ITEM_LIMIT : itemLimit} = process.env
        
        // Get json response from the rss feed url
        const response = await axios.get(rssFeedUrl)
        const { items } = response.data

        // Retrieves the last added campaign
        const lastAddedCampaign = await this.campaignService.findLastAddedCampaign();
        
        // Retrieves an array of all subscriber email Ids
        const subscribers = await this.subscriberService.findAllSubscriberEmails();

        const lastAddedFeedItemDate = new Date(items[0].date_published).getTime()
        let lastAddedCampaignDate: any;
        if (lastAddedCampaign){
            lastAddedCampaignDate = new Date(lastAddedCampaign.createdAt).getTime()
        }

        // Takes the specified number of latest feed items
        const allItems = items.splice(0, itemLimit)

        // Checks if no campaign exists, or if items published after the last added campaign are found
        if ( !lastAddedCampaign || (lastAddedFeedItemDate > lastAddedCampaignDate)) {

            // New campaign created
            const newCampaign = await this.campaignService.createCampaign({ content: "Sample Content", subject: "Sample Subject" })
            
            // For every item in the rss feed
            const allPosts = allItems.map((item) => {

                // Creates a clickstat with the item's url and new campaign's id
                this.clickStatService.create({ campaignId: newCampaign.id, link: item.url })
                return (
                    `<div class="container">
                        <a href=${item.url}>
                            <h2>${item.title}</h2>
                        </a>
                        <p>${item.content_html}</p>
                    </div>`
                )
            })

            // Converts the array into a single string
            const feedItems = allPosts.join('')

            // An email with the latest feed items is sent to all subscribers
            await this.mailService.sendEmail(subscribers, newCampaign.subject, newCampaign.content, feedItems)
        }

        this.logger.debug('Called every two hours');
    }

}
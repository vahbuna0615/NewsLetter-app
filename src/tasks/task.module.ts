import { Module } from '@nestjs/common';
import { TasksService } from './task.service';
import { EmailService } from '../email/email.service';
import { CampaignService } from 'src/campaigns/campaigns.service';
import { SubscriberService } from 'src/subscribers/subscribers.service';
import { ClickStatService } from 'src/click_stats/click_stats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscriber } from 'src/subscribers/entities/subscriber.entity';
import { Campaign } from 'src/campaigns/entities/campaign.entity';
import { List } from 'src/lists/entities/list.entity';
import { Organization } from 'src/organizations/entities/organization.entity';
import { ClickStat } from 'src/click_stats/entities/click_stat.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Subscriber, Campaign, List, Organization, ClickStat])],
    providers: [TasksService, EmailService, CampaignService, SubscriberService, ClickStatService],
})
export class TasksModule { }
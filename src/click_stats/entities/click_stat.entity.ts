// click_stat.entity.ts
import { Campaign } from 'src/campaigns/entities/campaign.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';

@Entity('click_stats')
export class ClickStat {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Campaign, campaign => campaign.clickStats, { onDelete: 'CASCADE' })
    campaign: Campaign;

    @Column()
    link: string;

    @Column({ default: 0 })
    clickCount: number;

    @CreateDateColumn()
    createdAt: Date;
}
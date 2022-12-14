import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('FlashSale')
export class FlashSaleEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    flashSaleBegin: Date;

    @Column()
    flashSaleEnd: Date;

    @Column({ default: false })
    onSale: boolean;

    @Column({ nullable: true, default: false })
    notification: boolean;

    @CreateDateColumn({
        default: `now()`,
        nullable: false,
    })
    createAt: string;

    @UpdateDateColumn({
        default: `now()`,
        nullable: true,
    })
    updateAt: string;
}

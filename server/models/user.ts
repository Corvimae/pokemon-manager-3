import { Column, CreatedAt, HasMany, Model, Table, UpdatedAt } from 'sequelize-typescript';
import { AuthorizedUser } from './authorizedUser';
import { Campaign } from './campaign';
import { UserPermission } from './userPermission';

@Table
export class User extends Model {
  @Column
  profileId: string;
  
  @Column
  displayName: string;

  @Column
  email: string;
  
  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @HasMany(() => UserPermission)
  permissions: UserPermission[];

  public async isGM(campaign: Campaign): Promise<boolean>;
  public async isGM(campaignId: number): Promise<boolean>;
  public async isGM(campaignOrCampaignId: Campaign | number): Promise<boolean> {
    const campaignId = typeof campaignOrCampaignId === 'number' ? campaignOrCampaignId : campaignOrCampaignId.id;

    return await this.hasPermission('gm', campaignId);
  }

  public async hasPermission(key: string, value: number = null): Promise<boolean> {
    const permissionSet = this.permissions || await this.$get('permissions');

    return permissionSet.find(item => item.type === key && (value === null || item.value === value)) !== undefined;
  }

  public async isAuthorized(): Promise<boolean> {
    return (await AuthorizedUser.findOne({ 
      where: {
        profileId: this.profileId,
      },
    })) !== null;
  }
}
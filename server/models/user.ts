import { Column, CreatedAt, Model, Table, UpdatedAt } from 'sequelize-typescript';
import { AuthorizedUser } from './authorizedUser';
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

  public async isAuthorized(): Promise<boolean> {
    return (await AuthorizedUser.findOne({ 
      where: {
        profileId: this.profileId,
      },
    })) !== null;
  }
}
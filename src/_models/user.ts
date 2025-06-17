export default class User {
    public id?: number;
    public userId?: string;
    public password?: string;
    public eflexId?: string;
    public firstName?: string;
    public lastName?: string;
    public mobile?: string;
    public mobileVerified?: number;
    public email?: string;
    public emailVerified?: number;
    public userTypeId?: number;
    public userType?: string;
    public createdBy?: string;

    public User() {
        this.id = 0,
            this.userId = '',
            this.password = '',
            this.eflexId = '',
            this.firstName = '',
            this.lastName = '',
            this.mobile = '',
            this.mobileVerified = 0,
            this.email = '',
            this.emailVerified = 0,
            this.userTypeId = 0,
            this.userType = '',
            this.createdBy = ''
    }
}

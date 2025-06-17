export default class PersonalDetail {
    public id?: string;
    public userId?: string;
    public eflexId?: string;
    public firstName?: string;
    public middleName?: string;
    public lastName?: string;
    public mobile?: string;
    public email?: string;
    public gender?: string;
    public dob?: string;
    public maritalStatus?: string;
    public motherName?: string;
    public fatherName?: string;
    public panNo?: string;
    public aadharNo?: string;
    public userImage?: string;
    public panNoImage?: string;
    public aadharNoImage?: string;

    public UserType() {
        this.id = '',
            this.userId = '',
            this.eflexId = '',
            this.firstName = '',
            this.middleName = '',
            this.lastName = '',
            this.mobile = '',
            this.email = '',
            this.gender = '',
            this.dob = '',
            this.maritalStatus = '',
            this.motherName = '',
            this.fatherName = '',
            this.panNo = '',
            this.aadharNo = '',
            this.userImage = '',
            this.panNoImage = '',
            this.aadharNoImage = ''
    }
}
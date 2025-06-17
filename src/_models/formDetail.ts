export default class FormDetail {
    public id?: string;
    public formId?: string;
    public formType?: string;
    public filledBy?: string;
    public filledFor?: string;
    public formValue?: string;

    public FormDetail() {
        this.id = '',
            this.formId = '',
            this.formType = '',
            this.filledBy = '',
            this.filledFor = '',
            this.formValue = ''
    }
}
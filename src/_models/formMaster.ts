export default class FormMaster {
    public id?: number;
    public eflexId?: string;
    public formId?: string;
    public formType?: number;
    public formRule?: string;
    public formField?: string;

    public FormMaster() {
        this.id = 0,
            this.eflexId = '',
            this.formId = '',
            this.formType = 0,
            this.formRule = '',
            this.formField = ''
    }
}
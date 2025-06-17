export default class Email {
    public from?: string;
    public to?: string;
    public subject?: string;
    public html?: string;

    public Email() {
        this.from = '',
            this.to = '',
            this.subject = '',
            this.html = ''
    }
}
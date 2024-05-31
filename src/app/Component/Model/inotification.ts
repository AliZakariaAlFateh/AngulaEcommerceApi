export interface Notification {
    title: string;
    body: string;
    type: 'success' | 'warning' |'danger';
    hidden: boolean;
}

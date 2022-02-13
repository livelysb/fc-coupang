export default class AlertDto {
    message: string
    severity: string
    date: Date

    constructor(message: string, severity: string, date: Date) {
        this.message = message
        this.severity = severity
        this.date = date
    }

    static Success(message: string) {
        return new AlertDto(message, "success", new Date())
    }

    static Error(message: string) {
        return new AlertDto(message, "error", new Date())
    }
}
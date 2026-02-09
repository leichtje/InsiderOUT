import { TokenSensitivity } from "../../models/token.model";

export const sensitivity_colors = new Map<TokenSensitivity, string>([
    [TokenSensitivity.High, 'var(--severity-high)'],
    [TokenSensitivity.Medium, 'var(--severity-medium)'],
    [TokenSensitivity.Low, 'var(--severity-low)'],
]);

export const sensitivity_text = new Map<TokenSensitivity, string>([
    [TokenSensitivity.High, 'High'],
    [TokenSensitivity.Medium, 'Medium'],
    [TokenSensitivity.Low, 'Low'],
]);



export type Token = string;

export type TokenPayload = {
    id: string;
    email: string;
    admin?: boolean;
};
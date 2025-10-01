export enum SortOder {
    ASC='asc',
    DESC='desc',
}

export class BaseResponseDTO<T> {
    success: boolean;
    data: T;
    createdAt: Date;
    message: string;

    constructor(data:T,message:string = 'Success') {
        this.success = true;
        this.data = data;
        this.message = message;
        this.createdAt = new Date();
    }
}
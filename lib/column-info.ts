import {FilterInfo} from './filter-info';

export class ColumnInfo {
    constructor(public name: string,
                public comment: string,
                public allowSort = true,
                public filterInfo: FilterInfo = new FilterInfo(''),
                public columnFormat: ColumnFormat = ColumnFormat.Default,
                public editable = false) {
    }
}

export enum ColumnFormat {
    Date,
    Datetime,
    Number,
    Currency,
    Default,
    Boolean,
    Picture,
    Template
}

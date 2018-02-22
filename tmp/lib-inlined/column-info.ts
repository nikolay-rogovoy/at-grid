import {FilterInfo} from './filter-info';

/**Информация о колонке*/
export class ColumnInfo {

    /**Сортировка текущей колонки*/
    columnSort = ColumnSort.None;

    /**Порядок сортировок если несклько колонок*/
    columnSortNumber = 0;

    /**Конструктор*/
    constructor(public name: string,
                public comment: string,
                public allowSort = true,
                public filterInfo: FilterInfo = new FilterInfo(''),
                public columnFormat: ColumnFormat = ColumnFormat.Default,
                public editable = false) {
    }
}

/**Форматы колонки*/
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

/**Сортировки колонки*/
export enum ColumnSort {
    Ask,
    Desc,
    None
}

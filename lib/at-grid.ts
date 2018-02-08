import {
  Component, OnInit, AfterViewChecked, Input, Output,
  EventEmitter, ViewChild
} from '@angular/core';
import {ColumnInfo, ColumnFormat} from './column-info';
import {NgForm} from '@angular/forms';
import {ChangedCellArgs} from "./changed-cell-args";

@Component({
  moduleId: module.id,
  selector: 'at-grid',
  styleUrls: ['at-grid.css'],
  templateUrl: 'at-grid.html'
})
export class AtGrid implements  OnInit, AfterViewChecked {

    /**Данные*/
    @Input()
    data: Array<Object> = [];

    /**Колонки*/
    @Input()
    metaData: ColumnInfo[] = [];

    /**Количество строк на странице*/
    @Input()
    quRowOnPage: number = 10;

    /**Статический режим*/
    @Input()
    staticMode: boolean = true;

    /**Текущая страница*/
    @Input()
    currentPage: number = 0;

    /**Текущая страница*/
    @Input()
    imageSize: number = 100;

    /**Для установки стиля ячейки (row: Object, column: ColumnInfo) => {({'background-color': 'red'})}*/
    @Input()
    callbackSetCellStyle: Function;

    /**Выделене какой-то позиции*/
    @Output()
    onSelect = new EventEmitter<Object>();

    /**Форма*/
    @ViewChild('myForm')
    form: NgForm;

    /**Номер строки с наведенной мышкой*/
    rowNumMouseOver: number;

    /**Ячейка под указателем*/
    cellOver: ColumnInfo;

    /**Выделене какой-то позиции*/
    @Output()
    onLoad = new EventEmitter<number>();

    /***/
    @Output()
    onChanged = new EventEmitter<ChangedCellArgs>();

    /**Энум в компонет*/
    public columnFormat = ColumnFormat;

    constructor() {
        this.callbackSetCellStyle = (row: Object, column: ColumnInfo) => {};
    }

    /**Инит компонента*/
    ngOnInit() {
    }

    /**После загрузки вьюхи*/
    ngAfterViewChecked() {
    }

    /**Выделить строку*/
    selectRow(item: Object) {
        this.onSelect.emit(item);
    }

    /**Первая страница*/
    firstPage() {
        this.currentPage = 0;
    }

    /**Первая страница*/
    lastPage() {
        this.currentPage = this.getQuPage() - 1;
    }

    /**Первая страница*/
    nextPage() {
        if (this.currentPage < (this.getQuPage() - 1)) {
            this.currentPage++;
        } else {
            this.currentPage = this.getQuPage() - 1;
        }
    }

    /**Первая страница*/
    prevPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
        } else {
            this.currentPage = 0;
        }
    }

    /**Количество страниц*/
    getQuPage(): number {
        let result = Math.ceil(this.applyFilter().length / this.quRowOnPage);
        if (result <= 0) {
            result = 1;
        }
        return result;
    }

    /**Номер страницы от 1*/
    getHumanCurrentPage(): number {
        return this.currentPage + 1;
    }

    applyFilter(): Array<Object> {
        let result: Array<Object> = [];

        for (let item of this.data) {
            let checkFilter = true;
            for (let column of this.metaData) {
                if (column.filterInfo.value !== '') {
                    if (item[column.name] != null && item[column.name].toString().indexOf(column.filterInfo.value) !== -1) {
                        // Условие правильное
                    } else {
                        checkFilter = false;
                        break;
                    }
                }
            }

            if (checkFilter) {
                result.push(item);
            }
        }
        return result;
    }

    /**Получить строки для страницы*/
    getRowForPage(): Array<Object> {
        let index = 0;
        let result: Array<Object> = [];
        for (let item of this.applyFilter()) {
            if (index >= this.currentPage * this.quRowOnPage && index < (this.currentPage + 1) * this.quRowOnPage) {
                result.push(item);
            }
            index++;
        }
        return result;
    }

    /**Фильтр изменен*/
    filterChanged(filter: any) {
        console.log(filter);
    }

    /***/
    mouseOver(rowNum: number) {
        this.rowNumMouseOver = rowNum;
    }

    /***/
    mouseOverCell(cellOver: ColumnInfo) {
        this.cellOver = cellOver;
    }

    /***/
    getCellId(rowNum: number, colNum: number): string {
        return `at_grid_cell_${rowNum}'_'${colNum}`;
    }

    /**Ячейка изменена*/
    changedCell(param: ChangedCellArgs) {
        this.onChanged.emit(param);
    }

    /***/
    isAllowEdit(rowNum: number, column: ColumnInfo) {
        // && column === this.cellOver && rowNum === this.rowNumMouseOver
        return column.editable;
    }

    /***/
    setDatetime(item: object, column: ColumnInfo, value: any) {
        item[column.name] = new Date(value);
    }
}

import {
  Component, OnInit, AfterViewChecked, Input, Output,
  EventEmitter, ViewChild
} from '@angular/core';
import {ColumnInfo, ColumnFormat} from './column-info';
import {NgForm} from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'at-grid',
  styles: [`
    .uneven_row{background-color:#f9f9f9}.even_row{background-color:#ffffff}.uneven_row_mouse_over{background-color:#e9f9f9}.even_row_mouse_over{background-color:#e9f9f9}.base_row_tr{cursor:pointer}.base_row_td{padding:10px}.base_header_tr{cursor:pointer}.base_header_td{padding:10px}input,select{width:100%}li{padding-left:200px}td.last{width:1px;white-space:nowrap}.at-table{border-radius:10px}
  `],
  template: `
    <form name="form" id="form" #myForm="ngForm">
      <table width="100%" style="width:100%" border="1" class="at-table">
        <thead>
          <tr class="base_header_tr">
            <td *ngFor="let column of metaData"
                class="base_header_td">
              <b>{{column.comment}}</b>
            </td>
          </tr>
          <tr>
            <td *ngFor="let column of metaData">
              <input type="text" [name]="column.name" [id]="column.name" [(ngModel)]="column.filterInfo.value" (ngModelChange)="filterChanged($event)">
            </td>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of getRowForPage(); let idx = index"
              [ngClass]="{ 'even_row': (idx % 2 == 0) && rowNumMouseOver != idx,
               'uneven_row': (idx % 2 == 1) && rowNumMouseOver != idx,
               'even_row_mouse_over': (idx % 2 == 0) && rowNumMouseOver == idx,
               'uneven_row_mouse_over': (idx % 2 == 1) && rowNumMouseOver == idx
               }"
              class="base_row_tr"
              (click)="selectRow(item)"
              (mouseleave)="mouseOver(null)"
              (mouseover)="mouseOver(idx)"
          >
            <td *ngFor="let column of metaData"
                class="base_row_td" [ngStyle] = "callbackSetCellStyle(item, column)">
              <div *ngIf="column.columnFormat == columnFormat.Number" align="right">
                {{item[column.name]|number}}
              </div>
              <div *ngIf="column.columnFormat == columnFormat.Currency" align="right">
                {{item[column.name]|number:'1.2-2'}}
              </div>
              <div *ngIf="column.columnFormat == columnFormat.Date">
                {{item[column.name]|date:'dd.MM.yyyy'}}
              </div>
              <div *ngIf="column.columnFormat == columnFormat.Default">
                {{item[column.name]}}
              </div>
              <div *ngIf="column.columnFormat == columnFormat.Boolean">
                <input type="checkbox" [(ngModel)]="item[column.name]" [id]="'col_' + column.name + '_' + idx" [name]="'col_' + column.name + '_' + idx"/>
              </div>
              <div *ngIf="column.columnFormat == columnFormat.Picture && item[column.name] != null">
                <img [width]="imageSize" [height]="imageSize" [src]="item[column.name] | safeHtml" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <button (click)="firstPage()" type="button"> << </button>
      <button (click)="prevPage()" type="button"> < </button>
      {{getHumanCurrentPage()}} из {{getQuPage()}}
      <button (click)="nextPage()" type="button"> > </button>
      <button (click)="lastPage()" type="button"> >> </button>
    </form>
  `
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

    /**Выделене какой-то позиции*/
    @Output()
    onLoad = new EventEmitter<number>();

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

    mouseOver(rowNum: number) {
        this.rowNumMouseOver = rowNum;
    }

}

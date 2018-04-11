import {
  Component, OnInit, AfterViewChecked, Input, Output,
  EventEmitter, ViewChild
} from '@angular/core';
import {ColumnInfo, ColumnFormat, ColumnSort} from './column-info';
import {NgForm} from '@angular/forms';
import {ChangedCellArgs} from "./changed-cell-args";

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
                        <div style="display: flex; width: 100%" (click)="changeSort(column)">
                            <div style="flex: auto;"><b>{{column.comment}}</b></div>
                            <div style="margin-left: 5px;" [ngStyle] = "{'max-width': arrowWidth + 'px', flex: 'auto'}"><!---->
                                <svg *ngIf = "column.columnSort === columnSort.Desc" [attr.height] = "arrowHeight" [attr.width] = "arrowWidth">
                                    <line [attr.x1]="0"
                                          [attr.y1]="arrowHeight / 4"
                                          [attr.x2]="arrowWidth / 2"
                                          [attr.y2]="arrowHeight * 3 / 4"
                                          fill="none" stroke="black" stroke-width="1px" stroke-opacity="1"/>
                                    <line [attr.x1]="arrowWidth / 2"
                                          [attr.y1]="arrowHeight * 3 / 4"
                                          [attr.x2]="arrowWidth"
                                          [attr.y2]="arrowHeight / 4"
                                          fill="none" stroke="black" stroke-width="1px" stroke-opacity="1"/>
                                    <!--<line [attr.x1]="arrowWidth / 2"-->
                                          <!--[attr.y1]="0"-->
                                          <!--[attr.x2]="arrowWidth / 2"-->
                                          <!--[attr.y2]="arrowHeight"-->
                                          <!--fill="none" stroke="black" stroke-width="1px" stroke-opacity="1"/>-->
                                </svg>
                                <svg *ngIf = "column.columnSort === columnSort.Ask" [attr.height] = "arrowHeight" [attr.width] = "arrowWidth">
                                    <line [attr.x1]="0"
                                          [attr.y1]="arrowHeight * 3 / 4"
                                          [attr.x2]="arrowWidth / 2"
                                          [attr.y2]="arrowHeight / 4"
                                          fill="none" stroke="black" stroke-width="1px" stroke-opacity="1"/>
                                    <line [attr.x1]="arrowWidth / 2"
                                          [attr.y1]="arrowHeight / 4"
                                          [attr.x2]="arrowWidth"
                                          [attr.y2]="arrowHeight *3 / 4"
                                          fill="none" stroke="black" stroke-width="1px" stroke-opacity="1"/>
                                    <!--<line [attr.x1]="arrowWidth / 2"-->
                                          <!--[attr.y1]="0"-->
                                          <!--[attr.x2]="arrowWidth / 2"-->
                                          <!--[attr.y2]="arrowHeight"-->
                                          <!--fill="none" stroke="black" stroke-width="1px" stroke-opacity="1"/>-->
                                </svg>

                            </div>
                            <div *ngIf="this.showSortOrder && column.columnSort !== columnSort.None"
                                    [ngStyle] = "{'max-width': arrowWidth + 'px', flex: 'auto'}">
                                {{column.columnSortNumber}}
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td *ngFor="let column of metaData">
                        <input
                                type="text"
                                [name]="column.name"
                                [id]="column.name"
                                [(ngModel)]="column.filterInfo.value"
                                (ngModelChange)="filterChanged($event)"/>
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
                    <td *ngFor="let column of metaData; let colNum = index"
                        style = "height: 1px;"
                        class="base_row_td" [ngStyle] = "callbackSetCellStyle(item, column)"
                        (mouseleave)="mouseOverCell(null)"
                        (mouseover)="mouseOverCell(column)"
                    >

                        <div *ngIf="column.columnFormat == columnFormat.Number && !isAllowEdit(idx, column)" align="right"
                             [id]="getCellId(idx, colNum)" style="height: 100%">
                            {{item[column.name]|number}}
                        </div>
                        <div *ngIf="column.columnFormat == columnFormat.Number && isAllowEdit(idx, column)" align="right"
                             [id]="getCellId(idx, colNum)"  style="height: 100%">
                            <input type="number"  pattern="^[-+]?[0-9]*[.,]?[0-9]+(?:[eE][-+]?[0-9]+)?$"
                                   [name]="'input' + getCellId(idx, colNum)" [id]="'input' + getCellId(idx, colNum)"
                                   style="border: none;"
                                   [ngClass]="{ 'even_row': (idx % 2 == 0) && rowNumMouseOver != idx,
                                                'uneven_row': (idx % 2 == 1) && rowNumMouseOver != idx,
                                                'even_row_mouse_over': (idx % 2 == 0) && rowNumMouseOver == idx,
                                                'uneven_row_mouse_over': (idx % 2 == 1) && rowNumMouseOver == idx
                                                }"
                                   [(ngModel)]="item[column.name]"
                                   (change)="changedCell({columnInfo: column, value: item})"
                                   (click)="$event.stopPropagation()"
                            />
                        </div>

                        <div *ngIf="column.columnFormat == columnFormat.Currency && !isAllowEdit(idx, column)" align="right"
                             [id]="getCellId(idx, colNum)" style="height: 100%">
                            {{item[column.name]|number:'1.2-2'}}
                        </div>
                        <div *ngIf="column.columnFormat == columnFormat.Currency && isAllowEdit(idx, column)" align="right"
                             [id]="getCellId(idx, colNum)" style="height: 100%">
                            <input type="number"  pattern="^[-+]?[0-9]*[.,]?[0-9]+(?:[eE][-+]?[0-9]+)?$"
                                   [name]="'input' + getCellId(idx, colNum)" [id]="'input' + getCellId(idx, colNum)"
                                   style="border: none;"
                                   [ngClass]="{ 'even_row': (idx % 2 == 0) && rowNumMouseOver != idx,
                                                'uneven_row': (idx % 2 == 1) && rowNumMouseOver != idx,
                                                'even_row_mouse_over': (idx % 2 == 0) && rowNumMouseOver == idx,
                                                'uneven_row_mouse_over': (idx % 2 == 1) && rowNumMouseOver == idx
                                                }"
                                   [(ngModel)]="item[column.name]"
                                   (change)="changedCell({columnInfo: column, value: item})"
                                   (click)="$event.stopPropagation()"
                            />
                        </div>

                        <div *ngIf="column.columnFormat == columnFormat.Date && !isAllowEdit(idx, column)"
                             [id]="getCellId(idx, colNum)" style="height: 100%">
                            {{item[column.name]|date:'dd.MM.yyyy'}}
                        </div>
                        <div *ngIf="column.columnFormat == columnFormat.Date && isAllowEdit(idx, column)"
                             [id]="getCellId(idx, colNum)" style="height: 100%"
                             (click)="$event.stopPropagation()">
                            <input type="date"  [name]="'input' + getCellId(idx, colNum)"
                                   [id]="'input' + getCellId(idx, colNum)"
                                   style="border: none;"
                                   [ngClass]="{ 'even_row': (idx % 2 == 0) && rowNumMouseOver != idx,
                                                'uneven_row': (idx % 2 == 1) && rowNumMouseOver != idx,
                                                'even_row_mouse_over': (idx % 2 == 0) && rowNumMouseOver == idx,
                                                'uneven_row_mouse_over': (idx % 2 == 1) && rowNumMouseOver == idx
                                                }"
                                   [ngModel]="item[column.name] | date:'yyyy-MM-dd'"
                                   (ngModelChange)="item[column.name] = $event"
                                   (change)="changedCell({columnInfo: column, value: item})"
                                   (click)="$event.stopPropagation()"
                            />
                        </div>

                        <div *ngIf="column.columnFormat == columnFormat.Datetime && !isAllowEdit(idx, column)"
                             [id]="getCellId(idx, colNum)" style="height: 100%">
                            {{item[column.name]|date:'dd.MM.yyyy hh:mm'}}
                        </div>
                        <div *ngIf="column.columnFormat == columnFormat.Datetime && isAllowEdit(idx, column)"
                             [id]="getCellId(idx, colNum)" style="height: 100%"
                             (click)="$event.stopPropagation()">
                            <input type="datetime-local"  [name]="'input' + getCellId(idx, colNum)"
                                   [id]="'input' + getCellId(idx, colNum)"
                                   style="border: none;"
                                   [ngClass]="{ 'even_row': (idx % 2 == 0) && rowNumMouseOver != idx,
                                                'uneven_row': (idx % 2 == 1) && rowNumMouseOver != idx,
                                                'even_row_mouse_over': (idx % 2 == 0) && rowNumMouseOver == idx,
                                                'uneven_row_mouse_over': (idx % 2 == 1) && rowNumMouseOver == idx
                                                }"
                                   [ngModel]="item[column.name] | date:'yyyy-MM-ddThh:mm'"
                                   (ngModelChange)="setDatetime(item, column, $event)"
                                   (change)="changedCell({columnInfo: column, value: item})"
                                   (click)="$event.stopPropagation()"
                            />
                        </div>

                        <div *ngIf="column.columnFormat == columnFormat.Default && !isAllowEdit(idx, column)"
                             [id]="getCellId(idx, colNum)"
                             style="height: 100%">
                            {{item[column.name]}}
                        </div>
                        <div *ngIf="column.columnFormat == columnFormat.Default && isAllowEdit(idx, column)"
                             [id]="getCellId(idx, colNum)"
                             style="height: 100%">
                            <input type="text"  [name]="'input' + getCellId(idx, colNum)"
                                   [id]="'input' + getCellId(idx, colNum)"
                                   style="border: none;"
                                   [ngClass]="{ 'even_row': (idx % 2 == 0) && rowNumMouseOver != idx,
                                                'uneven_row': (idx % 2 == 1) && rowNumMouseOver != idx,
                                                'even_row_mouse_over': (idx % 2 == 0) && rowNumMouseOver == idx,
                                                'uneven_row_mouse_over': (idx % 2 == 1) && rowNumMouseOver == idx
                                                }"
                                   [(ngModel)]="item[column.name]"
                                   (change)="changedCell({columnInfo: column, value: item})"
                                   (click)="$event.stopPropagation()"
                            />
                        </div>

                        <div *ngIf="column.columnFormat == columnFormat.Boolean"
                             [id]="getCellId(idx, colNum)"
                             style="height: 100%">
                            <input type="checkbox"
                                   [id]="'col_' + column.name + '_' + idx" [name]="'col_' + column.name + '_' + idx"
                                   style="border: none;"
                                   [ngClass]="{ 'even_row': (idx % 2 == 0) && rowNumMouseOver != idx,
                                                'uneven_row': (idx % 2 == 1) && rowNumMouseOver != idx,
                                                'even_row_mouse_over': (idx % 2 == 0) && rowNumMouseOver == idx,
                                                'uneven_row_mouse_over': (idx % 2 == 1) && rowNumMouseOver == idx
                                                }"
                                   [(ngModel)]="item[column.name]"
                                   (change)="changedCell({columnInfo: column, value: item})"
                            />
                        </div>

                        <div *ngIf="column.columnFormat == columnFormat.Picture && item[column.name] != null"
                             [id]="getCellId(idx, colNum)"
                             style="height: 100%">
                            <img [width]="imageSize" [height]="imageSize" [src]="item[column.name] | safeHtml" />
                        </div>

                        <div *ngIf="column.columnFormat == columnFormat.Template && item[column.name] != null"
                             [id]="getCellId(idx, colNum)"
                             style="height: 100%">
                            <ng-container *ngTemplateOutlet="item[column.name].template;context:item[column.name].context"></ng-container>
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

    /**Имя грида для хранения лайаутов*/
    @Input()
    name = 'at-grid';

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

    /**Энум в компонет*/
    public columnSort = ColumnSort;

    /**Ширина стрелки сортировки*/
    arrowWidth = 0;

    /**Высота стрелки сортировки*/
    arrowHeight = 0;

    /**Показать порядок сортировки*/
    showSortOrder = false;

    /**Конструктор*/
    constructor() {
        this.callbackSetCellStyle = (row: Object, column: ColumnInfo) => {};
    }

    /**Инит компонента*/
    ngOnInit() {
        const fontSize = this.getDefaultFontSize();
        this.arrowWidth = fontSize / 2;
        this.arrowHeight = fontSize;
        // Восстановить лайауты
        this.restoreLayouts();
        this.calcShowSortOrder();
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

    /**Наложить автофильтр*/
    applyFilter(): Array<Object> {
        let result: Array<Object> = [];

        for (let item of this.data) {
            let checkFilter = true;
            for (let column of this.metaData) {
                if (column.filterInfo.value !== '' && column.filterInfo.value) {
                    if (item[column.name] != null) {
                        let testString = item[column.name].toString();
                        let filterText = column.filterInfo.value;
                        // Отпиливаем первую звездочку звездочку
                        if (filterText[0] === '*') {
                            filterText = filterText.substring(1);
                        } else {
                            // Текст должен начинаться с фильтра
                            filterText = '^' + filterText;
                        }
                        // Экранировать слэш
                        filterText = filterText.split('\\').join(`\\\\`);
                        // Экранировать плюс
                        filterText = filterText.split('+').join(`\\+`);
                        // Остальные звездочки заменяем на любые символы
                        filterText = filterText.split('*').join(`[\\w\\W]+`);
                        // Вопрос - это любой символ
                        filterText = filterText.split('?').join(`[\\w\\W]{1}`);
                        //column.filterInfo.value
                        try {
                            console.log(filterText);
                            let pattern = new RegExp(filterText, 'i');
                            // Условие правильное
                            checkFilter = pattern.test(testString);
                        } catch (error) {
                            console.error('Ошибка регулярного выражения', error);
                        }
                    } else {
                        checkFilter = false;
                    }
                }
                if (!checkFilter) {
                    break;
                }
            }
            if (checkFilter) {
                result.push(item);
            }
        }
        return result;
    }

    /**Сравнить две строки*/
    compareColumn(a: object, b: object, columnInfo: ColumnInfo): number {
        let fieldValueA = a[columnInfo.name];
        let fieldValueB = b[columnInfo.name];
        if (fieldValueA == null && fieldValueB == null) {
            return 0;
        } else if (fieldValueA == null) {
            return -1;
        } else if (fieldValueB == null) {
            return 1;
        } else {
            switch (columnInfo.columnFormat) {
                case ColumnFormat.Datetime:
                    return (<Date>fieldValueA).getTime() - (<Date>fieldValueB).getTime();
                case ColumnFormat.Date:
                    return (<Date>fieldValueA).getTime() - (<Date>fieldValueB).getTime();
                case ColumnFormat.Default:
                    return (<string>fieldValueA).localeCompare(<string>fieldValueB);
                case ColumnFormat.Number:
                    return (<number>fieldValueA) - (<number>fieldValueB);
                case ColumnFormat.Currency:
                    return (<number>fieldValueA) - (<number>fieldValueB);
                case ColumnFormat.Boolean:
                    return (Number(fieldValueA)) - (Number(fieldValueB));
                default:
                    return 0;
            }
        }
    }

    /**Получить строки для страницы*/
    getRowForPage(): Array<Object> {
        let index = 0;
        let result: Array<Object> = [];
        for (let item of this.applyFilter().sort((a, b) => {
            for (let col of this.metaData
                .filter(x => x.columnSort !== ColumnSort.None)
                .sort((a, b) => a.columnSortNumber - b.columnSortNumber)) {
                let compareResult = this.compareColumn(a, b, col);
                if (compareResult === 0) {
                    // Переходим к следующей колонке, данные равны
                } else {
                    return compareResult * (col.columnSort === ColumnSort.Desc ? - 1 : 1);
                }
            }
            return 0;
        })) {
            if (index >= this.currentPage * this.quRowOnPage && index < (this.currentPage + 1) * this.quRowOnPage) {
                result.push(item);
            }
            index++;
        }
        return result;
    }

    /**Фильтр изменен*/
    filterChanged(filter: any) {
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

    /**Получить размер шрифта по умолчанию*/
    getDefaultFontSize(): number {
        const who = document.createElement('div');

        who.style.cssText = 'display:inline-block; padding:0; line-height:1; position:absolute; visibility:hidden; font-size:1em';

        who.appendChild(document.createTextNode('M'));
        document.body.appendChild(who);
        const fs = who.offsetHeight;
        document.body.removeChild(who);
        return +fs;
    }

    /***/
    calcShowSortOrder() {
        this.showSortOrder = this.metaData
            .filter(x => x.columnSort !== ColumnSort.None).length > 1;
    }

    /**Изменить сортировку колонки*/
    changeSort(columnInfo: ColumnInfo) {
        if (columnInfo.columnFormat === ColumnFormat.Template || columnInfo.columnFormat === ColumnFormat.Picture) {
            // По этим колонкам сортировать нельзя :)
            return;
        }
        if (columnInfo.allowSort) {
            if (columnInfo.columnSort === ColumnSort.None) {
                // Номер колонки для сортировки
                let columnSortNumber = 1;
                for (let col of this.metaData) {
                    if (col.columnSort !== ColumnSort.None) {
                        columnSortNumber++;
                    }
                }
                columnInfo.columnSort = ColumnSort.Ask;
                columnInfo.columnSortNumber = columnSortNumber;
                console.log(columnInfo);
            } else if (columnInfo.columnSort === ColumnSort.Ask) {
                columnInfo.columnSort = ColumnSort.Desc;
            } else if (columnInfo.columnSort === ColumnSort.Desc) {
                columnInfo.columnSort = ColumnSort.None;
                columnInfo.columnSortNumber = 0;
                // Пересортировываем порядок сортировок :)
                let i = 1;
                for (let col of this.metaData
                    .filter(x => x.columnSort !== ColumnSort.None)
                    .sort((a, b) => a.columnSortNumber - b.columnSortNumber)) {
                    if (col.columnSort !== ColumnSort.None) {
                        col.columnSortNumber = i++;
                    }
                }
            }
            this.calcShowSortOrder();
            this.saveLayouts();
        }
    }

    /***/
    getOutGridName() {
        return `AtGridLayouts-${this.name}`;
    }
    /***/
    saveLayouts() {
        let data = JSON.stringify(this.metaData);
        localStorage.setItem(this.getOutGridName(), data);
    }

    /***/
    restoreLayouts() {
        if (localStorage.getItem(this.getOutGridName()) != null) {
            let data = <ColumnInfo[]>JSON.parse(localStorage.getItem(this.getOutGridName()));
            for (let di of data) {
                let someCols = this.metaData.filter(x => x.name === di.name);
                if (someCols.length > 0) {
                    let someCol = someCols[0];
                    if (di.columnSort !== ColumnSort.None) {
                        someCol.columnSort = di.columnSort;
                        someCol.columnSortNumber = di.columnSortNumber;
                    }
                }
            }
        }
    }
}

import {
  Component, OnInit, AfterViewChecked, Input, Output,
  EventEmitter, ViewChild
} from '@angular/core';
import {ColumnInfo, ColumnFormat} from './column-info';
import {NgForm} from '@angular/forms';

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

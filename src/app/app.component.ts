import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemService } from './services/item.service';
import { Item } from './interfaces/item.interface';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  datasource = new MatTableDataSource<Item>();

  minDate = new Date();

  displayColumns = ['id', 'name', 'text', 'actions'];

  openModal: boolean = false;

  pageSizeOptions = [5, 10, 20];

  pageSize?: number;
  currentPage?: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public itemService: ItemService) {}

  ngOnInit(): void {
    setTimeout(() => {
      const savedSettings = this.itemService.loadSettings();

      if (savedSettings) {
        this.pageSize = savedSettings.pageSize;
        this, (this.currentPage = savedSettings.currentPage);
      } else {
        this.pageSize = 5;
        this.currentPage = 0;
      }

      this.fetchAllUser();

      this.paginator.pageIndex = this.currentPage;

      this.datasource.paginator = this.paginator;
    }, 0);
  }

  openDialog(item: Item) {
    this.openModal = true;
    this.itemService.itemToEdit = item;
  }

  deleteItem(itemId: Item) {
    this.itemService.delete(itemId);

    this.openModal = false;
  }

  addDemoData() {
    const demoData: Item = {
      id: 'test',
      name: 'rico',
      text: 'BORUSSIAA DORTMUND',
    };

    this.itemService.addUser(demoData);
  }

  update(item: Item) {
    this.itemService.updateItem(item);
  }

  updateName(name: string) {
    if (this.itemService.itemToEdit) {
      this.itemService.itemToEdit.name = name;
    }
  }

  deleteAll() {
    this.itemService.deleteAll();
  }

  fetchAllUser() {
    this.itemService.$item.subscribe((data) => {
      this.datasource.data = data;
      this.datasource.paginator = this.paginator;

      console.log(this.paginator);
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.itemService.saveSettings({
      pageSize: event.pageSize,
      currentPage: this.currentPage,
    });
  }
}

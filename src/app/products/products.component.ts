import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  paginatedProducts: any[] = [];
  tempProducts: any[] = [];
  currentPage = 1;
  itemsPerPage = 15;
  totalPages = 0;
  searchQuery = ""
  showContainer=true

  constructor(private http: HttpClient, private router: Router) {}

  onCardClick(id: number) {
    console.log('Clicked on card with ID:', id);
    this.router.navigate(['/product', id]);
  }

  paginate(data: any[], page_size: number, page_number: number) {
    const start_index = (page_number - 1) * page_size;
    const end_index = start_index + page_size;
    const page_data = data.slice(start_index, end_index);
    return {
      page_data,
      total_pages: Math.ceil(data.length / page_size),
      current_page: page_number,
    };
  }

  getPaginatedData(current_page = this.currentPage) {
    const sortedData = this.sortByAttribute('', this.tempProducts); // sort the temporary products array before paginating
    const { page_data, total_pages } = this.paginate(
      sortedData, // use the sorted data instead of the original products array
      this.itemsPerPage,
      current_page
    );
    this.paginatedProducts = page_data;
    this.totalPages = total_pages;
}


  getPagesArray(): number[] {
    const maxPages = 5; // maximum number of pages to display at once
    const pagesToShow = Math.min(maxPages, this.totalPages); // number of pages to display
    const half = Math.floor(pagesToShow / 2);
    let start: number, end: number;
    if (this.currentPage <= half) {
      start = 1;
      end = pagesToShow;
    } else if (this.currentPage >= this.totalPages - half) {
      start = this.totalPages - pagesToShow + 1;
      end = this.totalPages;
    } else {
      start = this.currentPage - half;
      end = this.currentPage + half;
    }
    const pages = [];
    if (start > 1) {
      pages.push(-1); // add ellipsis to indicate previous pages
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (end < this.totalPages) {
      pages.push(-2); // add ellipsis to indicate next pages
    }
    return pages;
  }



  searchCars(query : any, cars:any) {
    const searchQuery = query.toLowerCase();
    const filteredCars = cars.filter(function(car: { car: string; car_model: string; }) {
      const carName = car.car.toLowerCase();
      const carModel = car.car_model.toLowerCase();
      return carName.includes(searchQuery) || carModel.includes(searchQuery);
    });
    return filteredCars;
  }
  
  getSearchQuery(event: any){
    this.searchQuery = event.target.value
  }
  searchProducts() { // without type info
    this.tempProducts = this.searchCars(this.searchQuery,this.products)
    this.getPaginatedData()
    console.log(this.tempProducts);
    console.log("total pages "+this.totalPages);
    
  }

  

  sortByAttribute(attribute:any,arr:any=this.tempProducts) {
    const copyArr = [...arr];
    copyArr.sort((a, b) => {
      if (a[attribute] < b[attribute]) {
        return -1;
      }
      if (a[attribute] > b[attribute]) {
        return 1;
      }
      return 0;
    });
    return copyArr;
  }

  onOptionsSelected(value: string) {
    console.log(value);
    if (value === 'select') {
      this.tempProducts = [...this.products];
    } else {
      const sortedData = this.sortByAttribute(value, this.tempProducts);
      this.tempProducts = sortedData;
    }
    this.currentPage = 1; // reset to the first page after sorting
    this.getPaginatedData();
  }
  
  



  ngOnInit(): void {
    this.http.get<any>('https://myfakeapi.com/api/cars').subscribe(
      (data) => {
        this.products = data.cars;
        this.tempProducts = this.searchCars(this.searchQuery,this.products);
        console.log(this.tempProducts);
        
        this.getPaginatedData();        
      },
      (error) => {
        console.error(error);
      }
    );

  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.getPaginatedData();
  }
  onKeyPress(event: KeyboardEvent) {
    console.log(event.key);
    console.log(event.target);
  }
    
}



 
 

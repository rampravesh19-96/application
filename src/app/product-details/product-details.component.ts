import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent {
  productId: string | null = null;
  mydata: any;

  constructor(private route: ActivatedRoute, private router: Router,private http : HttpClient) { }

  getProduct(id:string) {
    this.http.get('https://myfakeapi.com/api/cars/'+id).subscribe((data)=>{
      this.mydata = data;
      console.log(this.mydata.Car.id);
    })
  }
  
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      console.log(this.productId);
      if (this.productId !== null) {
        this.getProduct(this.productId);
      }
    });
  }
}

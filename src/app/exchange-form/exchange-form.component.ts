import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-exchange-form',
  templateUrl: './exchange-form.component.html',
  styleUrls: ['./exchange-form.component.css']
})
export class ExchangeFormComponent{

  hidden: boolean = true;
  currencies: string[] = ['JYP', 'USD', 'GBP', 'EUR', 'CNY', 'HKD'];
  defaultA: string = 'GBP';
  defaultB: string = 'USD';

  currencyForm: FormGroup;

  displayObj: any = {
    from: '',
    to: '',
    startValue: 0,
    endValue: 0, 
  }

  constructor(private http: HttpClient) {
      this.currencyForm = new FormGroup({
          inputValue: new FormControl(0),
          currencyA: new FormControl(null),
          currencyB: new FormControl(null)
      });
      this.currencyForm.controls['currencyA'].setValue(this.defaultA, {onlySelf: true});
      this.currencyForm.controls['currencyB'].setValue(this.defaultB, {onlySelf: true});
  }


  async onSubmit(){
    let input = this.currencyForm.value.inputValue
    let from = this.currencyForm.value.currencyA
    let to = this.currencyForm.value.currencyB
    let data: any = await this.getExchange()
    let final = await this.doConversion(data, from, to, input)

    this.displayObj.from = from
    this.displayObj.to = to
    this.displayObj.startValue = input
    this.displayObj.endValue = final
    this.hidden = false

  }

  URL = 'https://openexchangerates.org/api/latest.json?app_id=882b43a71232449f9738f4007a296f11'

  
  doConversion(data: any, baseSymbol: string, reqSymbol: string, input:number){
    console.log(baseSymbol)
    
    let dolConRate = (1 / data.rates[baseSymbol])
    let dolValue = (dolConRate * input)
    let final = (dolValue * data.rates[reqSymbol])
    return final

  }
  
  async getExchange(){
    let data = await this.http.get(this.URL).toPromise()
    return data
    
  }



}

import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as math from 'mathjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title:string = 'my-calc-app';
  screenString:string="0";
  screenSize:number=10; //<== max 10 digits are displayed
  isError:boolean=false;
  numbers = [];
  actions = [];
  mathString:string = "";

  // functionality

  enterDigit(calcForm:NgForm, numberToEnter:number) {
    if (this.isError == false && this.screenString.length <= this.screenSize-1) {
      if (numberToEnter == 0) {
        this.enterZero();    
      } else {
        this.enterNonZero(numberToEnter);
      }
      this.refreshScreen(calcForm);
    }
  }

  enterZero(){
    if (this.screenString != "0" && this.screenString != "-0") {
      this.screenString = this.screenString + "0";
    }
  }

  enterNonZero(numberToEnter:number){
    if (this.screenString == "0") {
      this.screenString = numberToEnter.toString();
    } else {
      this.screenString = this.screenString + numberToEnter.toString();
    }
  }

  enterDot(calcForm:NgForm) {
    if (this.isError == false) {
      if (!this.screenString.includes(".") && this.screenString.length <= this.screenSize) {
        this.screenString = this.screenString + ".";
        this.refreshScreen(calcForm);
      }
    }  
  }

  changeSign(calcForm:NgForm) {
    if (this.isError == false) {
      if(this.screenString.substring(0,1) != "-") {
        this.screenString = "-" + this.screenString
      } else {
        this.screenString = this.screenString.substring(1,this.screenString.length);
      }
      this.refreshScreen(calcForm);
    }
  }

  assignAction(selectedActionId:number){
    if (this.isError == false) {
      this.numbers.push(this.screenString);
      if (selectedActionId == 1) {
        this.actions.push("/");  
      } else if (selectedActionId == 2) {
        this.actions.push("*");   
      } else if (selectedActionId == 3) {
        this.actions.push("-"); 
      } else if (selectedActionId == 4) {
        this.actions.push("+");
      } else if (selectedActionId == 5) {
        this.actions.push("sqrt");
      }
      this.screenString = "";
    }
  }

  calculate(calcForm:NgForm){
    if (this.isError == false) {
      this.numbers.push(this.screenString);
      this.buildMathString();
      console.log("Math string to calculate : " + this.mathString);
      try { 
        var calcResult:number = math.evaluate(this.mathString);
          if (!isFinite(calcResult) || calcResult == undefined) {
            this.setError(calcForm);
          } else {
            this.screenString = calcResult.toPrecision(10);
            this.refreshScreen(calcForm);
            this.numbers = [];
            this.actions = [];
            this.mathString = "";
          }  
      } catch (ex) {
        this.setError(calcForm);
      }
    }  
  }

  buildMathString () {
      for (var i = 0; i < this.actions.length; i++) {
        if (this.actions[i] != "sqrt") {
          this.mathString = this.mathString + this.numbers[i] + this.actions[i];
        } else {
          this.mathString = this.mathString + "sqrt(" + this.numbers[i] + ")";
        }                
      }
      this.mathString = this.mathString + this.numbers[this.numbers.length-1];
  }

  refreshScreen(calcForm:NgForm) {
    calcForm.controls['screen'].setValue(this.screenString);
  }

  reset(calcForm:NgForm) {
    this.isError = false;
    this.numbers = [];
    this.actions = [];
    this.mathString = "";
    this.screenString="0";
    this.refreshScreen(calcForm);
  }

  setError(calcForm:NgForm) {
    this.screenString = "ERROR";
    this.isError = true;
    this.refreshScreen(calcForm);
  }

}
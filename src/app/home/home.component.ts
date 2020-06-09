import { Component, OnInit } from '@angular/core';
import { FormatService } from '../services/format.service';
import { NgForm } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  //Pre-defined formats from database
  formats = []
  // formats = [
  //   {'name':'disaster-girl'}, 
  //   {'name':'left-exit-12'}, 
  //   {'name':'expanding-brain'}, 
  //   {'name':'panik-kalm-panik'},
  //   {'name':'drake-hotline-bling'},
  //   {'name':'monkey-puppet'},
  //   {'name':'preaching-to-the-mobs'},
  //   {'name':'running-away-balloon'},
  //   {'name':'success-kid'},
  //   {'name':'the-rock-driving'},
  //   {'name':'uno-draw-25-cards'}
  // ] 

  isUploaded:any="none"       // To track upload progress   
  path                        // To uploaded file on google cloud storage
  image:any                   // Observable returned by storage for the uploaded file

  constructor(public formatService:FormatService, private storage:AngularFireStorage) { }

  ngOnInit(): void {
    //------------------Getting formats' info from firebase---------------
    this.formatService.getFormats().subscribe(res=>{
      this.formats = res
    })
  }

  scrollLeft() {
    document.getElementById('forScroll').scrollLeft -= 500
  }
  
  scrollRight() {
    document.getElementById('forScroll').scrollLeft += 500
  }

  clickUpload() {
    document.getElementById('uploadBtn').click();
  }

  SelectFile(event){
    let file = event.target.files[0]
    let date = new Date()                                               // Unique name for the file
    let unique = '/user_format/at'+ date.getTime()                      // Saving in folder
    this.isUploaded="process"
    let task = this.storage.upload(unique,file).then(data=>{
      this.path=unique                                                  // Saving path to uploaded file
      this.isUploaded="success"
      this.image = this.storage.ref(this.path).getDownloadURL()         // Saving URL to image uploaded
    }).catch(err=>{
      console.log(err)
      this.isUploaded="fail"
    })
  }

  setSrc() {
    this.formatService.setImgUrl(this.path)           // Storing path of uploaded file on local storage
  }
}

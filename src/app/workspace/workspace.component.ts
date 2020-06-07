import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import {fabric} from 'fabric';
import { FormatService } from '../services/format.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {

  formatName:String
  formatFields:Number
  coords = []
  text1:String=""
  textboxes = []
  id = []
  selectedId:number = 0
  defaultStyle:String = "Times New Roman"
  canvas

  constructor(private route: ActivatedRoute, public formatService: FormatService) { }
  
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.formatName = params['name'];
    });
  }

  ngAfterViewInit(canvas) {
    // ---------------------Initialising Canvas-----------------------------------
    canvas = new fabric.Canvas('canvas');
    var uploadedBool = (this.formatName == 'uploaded-img')
    var imgUrl = (uploadedBool) ? localStorage.getItem('url') : 'assets/formats/'+this.formatName+'.png'
    fabric.Image.fromURL(imgUrl, function(oImg) {
      var num = (window.screen.width > 800) ? (0.45 * window.screen.width) : (0.9 * window.screen.width)
      oImg.scaleToWidth(num, false)
      canvas.setDimensions({width: oImg.getScaledWidth(), height: oImg.getScaledHeight()});
      canvas.setBackgroundImage(oImg);
      canvas.set('selection', false);
      canvas.set('allowTouchScrolling', true);
    });
    if(window.screen.width > 630 && !uploadedBool) {
      this.formatService.getFormatDetails(this.formatName).subscribe(res => {
        this.formatFields = res[0].details.fields
        this.coords = res[0].details.coords

        // ---------------coords format:    [ (0)[color, fontsize, x, y], (1)[color, fontsize, x, y], ... ]
        for( let i:number = 0; i < this.formatFields; i++) {
          this.id.push(i)
          this.textboxes[i] = new fabric.Textbox( "Textbox"+(i+1) , { 
            fontSize: this.coords[i].fontsize,
            fill: this.coords[i].color,
            strokeWidth: 1,
            left: this.coords[i].x, 
            top: this.coords[i].y,
            fontFamily: this.defaultStyle,
            borderColor: this.coords[i].color,
            cornerColor: this.coords[i].color,
            cornerSize: 15,
            cornerStyle: "circle"
          });
          this.textboxes[i].on('selected', function() {
            globalThis.selectedId = i
          })
          canvas.add(this.textboxes[i]);
        }
      })
    } else {
      this.textboxes[0] = new fabric.Textbox( "Textbox1", {
        fontSize: 30,
        fill: "black",
        strokeWidth: 1,
        left: 20, 
        top: 20,
        fontFamily: this.defaultStyle,
        borderColor: "black",
        cornerColor: "black",
        cornerSize: 15,
        cornerStyle: "circle"
      })
      this.textboxes[0].on('selected', function() {
        globalThis.selectedId = 0
      })
      canvas.add(this.textboxes[0]);
    }
    this.formatFields = 1
    this.canvas = canvas
  }
  
  addTextbox() {
    let i = this.textboxes.length
    this.id.push(i)
    if(i > 9) {
      window.alert('You cannot add anymore textboxes!')
    }
    else {
      this.textboxes[i] = new fabric.Textbox( "Textbox"+(i+1) , { 
        fontSize: 50,
        fill: "black",
        strokeWidth: 1,
        left: 10, 
        top: 10,
        fontFamily: "Times New Roman",
        borderColor: "black",
        cornerColor: "black",
        cornerSize: 18,
        cornerStyle: "circle"
      });
      this.textboxes[i].on('selected', function() {
        globalThis.selectedId = i
      })
      this.canvas.add(this.textboxes[i])
    }
  }

  removeTextbox() {
    let i:number = (globalThis.selectedId == undefined) ? 0 : globalThis.selectedId
    this.canvas.remove(this.textboxes[i])
    this.textboxes[i].splice(i, 1)
    this.canvas.renderAll()
  }

  updateCanvas(updateForm:NgForm) {
    // console.log(updateForm.form.controls)
    // console.log(globalThis.selectedId)
    let i:number = (globalThis.selectedId == undefined) ? 0 : globalThis.selectedId

    this.textboxes[i].set('fill', (updateForm.form.controls.tb_fill.value == "") ? this.coords[i].color : updateForm.form.controls.tb_fill.value)
    this.textboxes[i].set('stroke', updateForm.form.controls.tb_stroke.value)
    this.textboxes[i].set('strokeWidth', updateForm.form.controls.tb_strokewidth.value)
    this.textboxes[i].set('fontFamily', (updateForm.form.controls.style.value == "") ? "Times New Roman" : updateForm.form.controls.style.value)
    this.textboxes[i].set('borderColor', (updateForm.form.controls.tb_fill.value == "") ? this.coords[i].color : updateForm.form.controls.tb_fill.value)
    this.textboxes[i].set('cornerColor', (updateForm.form.controls.tb_fill.value == "") ? this.coords[i].color : updateForm.form.controls.tb_fill.value)
    this.textboxes[i].set('cornerSize', 18)

    this.canvas.renderAll()
  }

  saveMeme() {
    var link = document.createElement("a");

    link.href = this.canvas.toDataURL({format: 'png', multiplier: 4});
    link.download = "My-Meme.png";
    link.click();
  }

  // scrollToTop() {
  //   document.body.scrollTop = 0;
  //   document.documentElement.scrollTop = 0;
  // }
  
}

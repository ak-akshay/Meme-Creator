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
  id = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
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
    fabric.Image.fromURL('assets/formats/'+this.formatName+'.png', function(oImg) {
      // oImg.scale(0.8)
      canvas.setDimensions({width: oImg.get('width'), height: oImg.get('height')});
      canvas.setBackgroundImage(oImg);
      canvas.set('selection', false);
      canvas.set('allowTouchScrolling', true);
    });

    this.formatService.getFormatDetails(this.formatName).subscribe(res => {
      this.formatFields = res[0].details.fields
      this.coords = res[0].details.coords

      // ---------------coords format:    [ (0)[color, fontsize, x, y], (1)[color, fontsize, x, y], ... ]
      for( let i:number = 0; i < this.formatFields; i++) {
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
        canvas.add(this.textboxes[i]);
      }
    })
    this.canvas = canvas
  }
  
  addTextbox() {
    let i = this.textboxes.length
    if(i > 9) {
      window.alert('You cannot add anymore textboxes!')
    }
    else {
      this.textboxes[i] = new fabric.Textbox( "Textbox"+(i+1) , { 
        fontSize: 30,
        fill: "black",
        strokeWidth: 1,
        left: 100, 
        top: 100,
        fontFamily: "Times New Roman",
        borderColor: this.coords[i].color,
        cornerColor: this.coords[i].color,
        cornerSize: 15,
        cornerStyle: "circle"
      });
      this.canvas.add(this.textboxes[i])
    }
  }

  updateCanvas(updateForm:NgForm) {
    // console.log(updateForm.form.controls)
    let i:number = updateForm.form.controls.id.value
    // for( let i:number = 0; i < this.formatFields; i++ ) {
      this.textboxes[i].set('fill', (updateForm.form.controls.tb_fill.value == "") ? this.coords[i].color : updateForm.form.controls.tb_fill.value)
      this.textboxes[i].set('stroke', updateForm.form.controls.tb_stroke.value)
      this.textboxes[i].set('strokeWidth', updateForm.form.controls.tb_strokewidth.value)
      this.textboxes[i].set('fontFamily', (updateForm.form.controls.style.value == "") ? "Times New Roman" : updateForm.form.controls.style.value)
    // }
    this.canvas.renderAll()
  }

  saveMeme() {
    var link = document.createElement("a");

    link.href = this.canvas.toDataURL({format: 'png', multiplier: 4});
    link.download = "My-Meme.png";
    link.click();
  }

  scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  
}

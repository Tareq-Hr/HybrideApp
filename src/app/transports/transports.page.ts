import { Component, OnInit } from '@angular/core';
import { AngularFireStorage} from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-transports',
  templateUrl: './transports.page.html',
  styleUrls: ['./transports.page.scss'],
})
export class TransportsPage implements OnInit {
  images = [];
  public searchTerm: string = "";
  constructor(
    public afSG: AngularFireStorage,
    public afDB: AngularFireDatabase
    
  ) {
   
  }



getImagesDatabase() {
  this.afDB.list('Places/').snapshotChanges(['child_added']).subscribe(images => {
    images.forEach(image => {
      this.getImagesStorage(image);
    });
  });
}

getImagesStorage(image: any) {
  this.images = [];
  const imgRef = image.payload.exportVal().images;
  this.afSG.ref(imgRef).getDownloadURL().subscribe(imgUrl => {
    console.log(imgUrl);
     if(image.payload.exportVal().categorie == 'transport'){
      if(this.searchTerm == ""){
    this.images.push({
      name: image.payload.exportVal().titre,
      url: imgUrl,
      adresse: image.payload.exportVal().adresse,
      long: image.payload.exportVal().longitude,
      lat: image.payload.exportVal().latitude
    });
  }else if(image.payload.exportVal().titre.toLowerCase().includes(this.searchTerm.toLowerCase())){
      
      this.images = [];
      const imgRef = image.payload.exportVal().images;
      this.afSG.ref(imgRef).getDownloadURL().subscribe(imgUrl => {
    console.log(imgUrl);
    this.images.push({
      name: image.payload.exportVal().titre,
      url: imgUrl,
      adresse: image.payload.exportVal().adresse,
      long: image.payload.exportVal().longitude,
      lat: image.payload.exportVal().latitude    });
  });
  }
}
});
 }
  ngOnInit() {
    this.getImagesDatabase();
  }
}

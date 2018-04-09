import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  tasksList: AngularFireList<any>;
  tasks: Observable<any[]>;
  title:string;

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public afDatabase: AngularFireDatabase) {
    this.tasksList = this.afDatabase.list('tasks');
    this.tasks = this.tasksList.valueChanges();
  }

  addTask() {
    let prompt = this.alertCtrl.create({
      title: 'Task Name',
      message: "Enter a name for this new task you're so keen on adding",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
        {
          name: 'description',
          placeholder: 'Description'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            const newTaskRef = this.tasksList.push({});
            newTaskRef.set({
              id: newTaskRef.key,
              title: data.title,
              description: data.description
            });
          }
        }
      ]
    });
    prompt.present();
  }

  updateTask(taskId){
    
    this.afDatabase.database.ref('tasks').child(taskId).once('value').then(
      snapshot=>{
        this.title=snapshot.description;
      }
    );
    let prompt = this.alertCtrl.create({
      title: 'Task Name',
      message: "Update task",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title',
          value:this.title
        },
        {
          name: 'description',
          placeholder: 'Description'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.tasksList.update(taskId, {
              title: data.title,
              description: data.description
            });
          }
        }
      ]
    });
    prompt.present();
  }


  removeTask(taskId:string){
    console.log(taskId);
    this.tasksList.remove(taskId);
  }
}


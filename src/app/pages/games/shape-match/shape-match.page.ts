import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-shape-match',
  templateUrl: './shape-match.page.html',
  styleUrls: ['./shape-match.page.scss'],
})
export class ShapeMatchPage implements OnInit {

  shapes: { image: string; description: string }[] = [
    { image: '/assets/shapes/circle.png', description: 'A round shape' },
    { image: '/assets/shapes/triangle.png', description: 'A three-sided shape' },
    { image: '/assets/shapes/rectangle.png', description: 'A four-sided shape with opposite sides equal' },
    { image: '/assets/shapes/star.png', description: 'A shape with many points like a star' },
    { image: '/assets/shapes/oval.png', description: 'An elongated, rounded shape' },
    { image: '/assets/shapes/hexagon.png', description: 'A six-sided shape' },
    { image: '/assets/shapes/heart.png', description: 'A shape that looks like a heart' },
    { image: '/assets/shapes/diamond.png', description: 'A four-sided shape with equal sides and opposite angles' }
  ];

  currentShapeIndex: number = 0;
  currentShape: { image: string; description: string } = this.shapes[this.currentShapeIndex];
  textInput: string = '';

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    console.log('Current Display Shape:', this.getCurrentShapeName());
  }

  submitForm() {
    console.log('Form submitted with text:', this.textInput);
    // Add further logic here as needed
  }

  async nextShape() {
    if (!this.textInput) {
      await this.presentToast('Please enter the shape name.');
      return; // Prevent advancing to the next shape
    }
  
    const expectedShapeName = this.getCurrentShapeName().toLowerCase();
    if (this.textInput.toLowerCase() !== expectedShapeName) {
      await this.presentToast('Incorrect shape name. Please try again.');
      return; // Prevent advancing to the next shape
    }
  
    this.currentShapeIndex++;
    this.currentShape = this.shapes[this.currentShapeIndex];
    console.log('Current Display Shape:', this.getCurrentShapeName());
  
    // Clear the text input for the next shape
    this.textInput = '';
  
    if (this.currentShapeIndex === this.shapes.length - 1) {
      // If it's the last shape (diamond), show the congratulatory alert
      this.presentCongratulatoryAlert();
    } else if (this.currentShapeIndex === this.shapes.length) {
      // If they try to go beyond the last shape, reset to the last shape
      this.currentShapeIndex = this.shapes.length - 1;
      this.currentShape = this.shapes[this.currentShapeIndex];
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      header: 'Alert', // Set the header to indicate information
      message: message,
      duration: 2000, // Duration in milliseconds
      position: 'top', // Position at the top
      cssClass: 'large-toast', // Add a custom CSS class for larger text
    });

    await toast.present();
  }

  async presentCongratulatoryAlert() {
    const alert = await this.alertController.create({
      header: 'Congratulations!',
      message: 'You\'ve completed the game!',
      buttons: [
        {
          text: 'Restart',
          handler: () => {
            // Handle restart logic (e.g., reset to the circle)
            this.currentShapeIndex = 0;
            this.currentShape = this.shapes[this.currentShapeIndex];
          }
        }
      ]
    });

    await alert.present();
  }

  prevShape() {
    if (this.currentShapeIndex > 0) {
      this.currentShapeIndex--;
      this.currentShape = this.shapes[this.currentShapeIndex];
      console.log('Current Display Shape:', this.getCurrentShapeName());
    }
  }

  getCurrentShapeName(): string {
    return this.currentShape.image.split('/').pop()?.split('.')[0] || 'Unknown Shape';
  }

  getCurrentShapeDescription(): string {
    return this.currentShape.description;
  }

  isPrevButtonDisabled(): boolean {
    return this.currentShapeIndex === 0;
  }

  isNextButtonDisabled(): boolean {
    return this.currentShapeIndex === this.shapes.length - 1;
  }
}
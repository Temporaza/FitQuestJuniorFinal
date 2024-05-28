import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-exercise-explanation',
  templateUrl: './exercise-explanation.page.html',
  styleUrls: ['./exercise-explanation.page.scss'],
})
export class ExerciseExplanationPage implements OnInit {
  @Input() task: any; // Input property to receive the task object
  explanation: string;

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.generateExplanation();
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  generateExplanation() {
    // Generate explanation based on the selected exercise
    switch (this.task.description) {
      case 'Jumping Jacks':
        this.explanation =
          'Jumping jacks are a great way to get your heart pumping and improve cardiovascular health.';
        this.task.imageFilename = 'jumpingJack.png';
        break;
      case 'Climbing Stairs':
        this.explanation =
          'Climbing stairs is an effective way to build leg strength and improve endurance.';
        this.task.imageFilename = 'climbingStairs.jpg';
        break;
      case 'Hula Hooping':
        this.explanation =
          'Hula hooping is a fun and effective exercise that can help improve coordination and burn calories.';
        this.task.imageFilename = 'hulaHoop.jpg';
        break;
      case 'Chair Squats':
        this.explanation =
          'Chair squats are a modified version of squats that can help strengthen your leg muscles and improve mobility.';
        this.task.imageFilename = 'chairSquat.jpg';
        break;
      case 'Stretching':
        this.explanation =
          'Stretching helps improve flexibility and range of motion, and can reduce the risk of injury during physical activity.';
        this.task.imageFilename = 'stretch.jpg';
        break;
      case 'Dance':
        this.explanation =
          'Dancing is a fun way to stay active and can help improve cardiovascular health, coordination, and mood.';
        this.task.imageFilename = 'dance.jpg';
        break;
      case 'Running':
        this.explanation =
          'Running is a high-intensity aerobic exercise that can help improve cardiovascular fitness and burn calories.';
        this.task.imageFilename = 'running.jpg';
        break;
      case 'Jump Rope':
        this.explanation =
          'Jumping rope is a great cardiovascular exercise that can improve coordination, agility, and endurance.';
        this.task.imageFilename = 'jumpRope.jpg';
        break;
      case 'Dance Routines':
        this.explanation =
          'Following dance routines is a fun and effective way to stay active and improve coordination and cardiovascular health.';
        this.task.imageFilename = 'dance.jpg';
        break;
      case 'Arm Circles':
        this.explanation =
          'Arm circles are a simple exercise that can help improve shoulder flexibility and mobility.';
        this.task.imageFilename = 'armRotate.jpg';
        break;
      case 'Squats':
        this.explanation =
          'Squats are a compound exercise that targets multiple muscle groups, including the quadriceps, hamstrings, and glutes.';
        this.task.imageFilename = 'squats.jpg';
        break;
      case 'Brisk Walking':
        this.explanation =
          'Brisk walking is a low-impact cardiovascular exercise that can help improve heart health and burn calories.';
        this.task.imageFilename = 'brisk.jpg';
        break;
      case 'Balancing Exercise One Leg':
        this.explanation =
          'Balancing exercises on one leg can help improve stability, balance, and proprioception.';
        this.task.imageFilename = 'oneLeg.jpg';
        break;
      case 'Neck Stretch':
        this.explanation =
          'Neck stretches can help relieve tension and improve flexibility in the neck and upper back.';
        this.task.imageFilename = 'neck.jpg';
        break;
      case 'Leg Stretch':
        this.explanation =
          'Leg stretches can help improve flexibility and range of motion in the legs, reducing the risk of injury and improving performance in physical activities.';
        this.task.imageFilename = 'leg.jpg';
        break;
      case 'Chair Exercise':
        this.explanation =
          'Chair exercises are modified versions of traditional exercises that can be performed while seated, making them suitable for individuals with limited mobility.';
        this.task.imageFilename = 'chair.jpg';
        break;
      case 'Run':
        this.explanation =
          'Running is a high-intensity aerobic exercise that can help improve cardiovascular fitness and burn calories.';
        this.task.imageFilename = 'running.jpg';
        break;
      case 'Bunny Hops':
        this.explanation =
          'Bunny hops are a plyometric exercise that can help improve lower body power and agility.';
        this.task.imageFilename = 'bunny.png';
        break;
      case 'Gentle Yoga':
        this.explanation =
          'Gentle yoga is a low-impact exercise that combines physical postures, breathing techniques, and meditation to improve flexibility, strength, and relaxation.';
        this.task.imageFilename = 'yoga.jpg';
        break;
      case 'Walking':
        this.explanation =
          'Walking is a low-impact cardiovascular exercise that can help improve heart health, reduce stress, and boost mood.';
        this.task.imageFilename = 'walk.jpg';
        break;
      case 'Balance Exercise':
        this.explanation =
          'Balance exercises can help improve stability, coordination, and proprioception, reducing the risk of falls and injuries.';
        this.task.imageFilename = 'balance.jpg';
        break;
      case 'Ball Toss':
        this.explanation =
          'Ball toss is an active and engaging activity that allows learners to practice their speaking skills and reinforce vocabulary.';
        this.task.imageFilename = 'ballToss.jpg';
        break;
      default:
        this.explanation =
          'No specific explanation available for this exercise.';
        break;
    }
  }
}

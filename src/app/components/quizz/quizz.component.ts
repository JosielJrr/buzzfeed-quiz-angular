import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import quizz_questions from '../../../assets/data/quizz_questions.json';

@Component({
  selector: 'app-quizz',
  imports: [CommonModule], // Importa CommonModule para usar diretivas como ngIf e ngFor
  templateUrl: './quizz.component.html',
  styleUrl: './quizz.component.css'
})
export class QuizzComponent implements OnInit {

  title: string = ""; // Armazena o título do questionário
  questions: any; // Armazena todas as perguntas do questionário
  questionSelected: any; // Armazena a pergunta atual exibida ao usuário

  answers: string[] = []; // Armazena as respostas selecionadas pelo usuário
  answerSelected: string = ""; // Armazena o resultado final do questionário

  questionIndex: number = 0; // Índice da pergunta atual
  questionMaxIndex: number = 0; // Número total de perguntas

  finished: boolean = false; // Indica se o questionário foi concluído

  constructor() { }

  ngOnInit(): void {
    // Inicializa o questionário se o JSON for carregado corretamente
    if (quizz_questions) {
      this.finished = false; // Define que o questionário ainda não foi concluído
      this.title = quizz_questions.title; // Define o título do questionário
      this.questions = quizz_questions.questions; // Carrega as perguntas
      this.questionSelected = this.questions[this.questionIndex]; // Seleciona a primeira pergunta
      this.questionMaxIndex = this.questions.length; // Armazena o número total de perguntas
    }
  }

  playerChoose(value: string) {
    // Registra a resposta do usuário e avança para a próxima pergunta
    this.answers.push(value);
    this.nextStep();
  }

  async nextStep() {
    this.questionIndex += 1; // Avança para a próxima pergunta

    if (this.questionMaxIndex > this.questionIndex) {
      // Atualiza a pergunta exibida, se houver mais perguntas
      this.questionSelected = this.questions[this.questionIndex];
    } else {
      // Caso contrário, calcula o resultado final
      const finalAnswer: string = await this.checkResult(this.answers);
      this.finished = true; // Marca o questionário como concluído
      this.answerSelected = quizz_questions.results[finalAnswer as keyof typeof quizz_questions.results]; // Define o resultado final
    }
  }

  async checkResult(answers: string[]) {
    // Determina a resposta mais escolhida pelo usuário
    const result = answers.reduce((previous, current, i, arr) => {
      if (
        arr.filter(item => item === previous).length >
        arr.filter(item => item === current).length
      ) {
        return previous; // Mantém a opção anterior se for mais frequente
      } else {
        return current; // Atualiza para a opção atual se for mais frequente
      }
    });
    return result; // Retorna a resposta predominante
  }
}

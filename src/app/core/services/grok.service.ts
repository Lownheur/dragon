import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, switchMap, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface GrokMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GrokResponse {
  choices: Array<{
    message: { role: string; content: string };
  }>;
}

@Injectable({ providedIn: 'root' })
export class GrokService {
  private readonly http = inject(HttpClient);
  private readonly apiKey = environment.grokApiKey;
  private readonly model = environment.grokModel;
  private readonly endpoint = 'https://api.x.ai/v1/chat/completions';

  private systemPrompt = `Tu es l'assistant IA de Dragon Life OS. Tu aides l'utilisateur à gérer sa vie : planification, objectifs, santé, sommeil, alimentation, travail, trajets. Sois concis, motivateur et orienté action. Réponds en français sauf si l'utilisateur écrit en anglais.`;

  sendMessage(messages: GrokMessage[]): Observable<string> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    });

    const body = {
      model: this.model,
      messages: [{ role: 'system', content: this.systemPrompt }, ...messages],
      temperature: 0.7,
    };

    return this.http.post<GrokResponse>(this.endpoint, body, { headers }).pipe(
      switchMap((res) => of(res.choices[0]?.message?.content ?? 'Réponse vide.'))
    );
  }
}

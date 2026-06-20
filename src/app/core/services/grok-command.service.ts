import { Injectable, inject } from '@angular/core';
import { GrokService } from './grok.service';
import { EvenementService } from './evenement.service';
import { ObjectifService } from './objectif.service';
import { DisciplineService } from './discipline.service';
import { ProfilService } from './profil.service';
import { SportRouteService, RunningRoute } from './sport-route.service';
import { EvenementType } from '../models/evenement.model';
import { DisciplineType } from '../models/discipline.model';
import { ObjectifPriority } from '../models/objectif.model';

export interface GrokCommand {
  command: string;
  data: Record<string, unknown>;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class GrokCommandService {
  private readonly grok = inject(GrokService);
  private readonly evenements = inject(EvenementService);
  private readonly objectifs = inject(ObjectifService);
  private readonly disciplines = inject(DisciplineService);
  private readonly profil = inject(ProfilService);
  private readonly sportRoute = inject(SportRouteService);

  private readonly systemPrompt = `Tu es l'assistant IA de Dragon Life OS. Tu es le CONTRÔLEUR CENTRAL de l'application. Tu ne réponds pas juste — tu AGIS.

Quand l'utilisateur te demande quelque chose, tu dois retourner UN SEUL bloc JSON valide (rien d'autre) décrivant la commande à exécuter.

Types de commandes disponibles:
- CREATE_EVENT: crée un événement dans l'EDT
- UPDATE_EVENT: modifie un événement
- DELETE_EVENT: supprime un événement
- CREATE_OBJECTIF: crée un objectif
- UPDATE_OBJECTIF: modifie un objectif
- COMPLETE_OBJECTIF: marque un objectif comme terminé
- CREATE_DISCIPLINE: crée une discipline
- UPDATE_PROFIL: met à jour le profil utilisateur
- SCHEDULE_ROUTINE: planifie des événements récurrents (ex: "courir 3x par semaine")
- GET_SPORT_SUGGESTION:获取运动建议和跑步路线 (demande du sport + position GPS → itinéraire course)
- GET_FOOD_SUGGESTION:获取饮食建议 (suggère quoi manger + crée événement courses)
- RESPOND: réponse simple sans action (bonjour, merci, conversation)

RÈGLES:
1. Réponds TOUJOURS avec un seul bloc JSON, jamais de texte additionnel
2. Pour SCHEDULE_ROUTINE avec "X fois par semaine", crée X événements répartis sur la semaine (lundi, mercredi, vendredi par exemple)
3. Les dates/heures en ISO 8601 (YYYY-MM-DDTHH:mm)
4. Les couleurs en hex: sport=#e74c3c, sleep=#9b59b6, food=#2ecc71, work=#3498db, travel=#f39c12, study=#1abc9c, health=#e91e63, other=#95a5a6
5. Pour un nouvel objectif, choisis une discipline existante ou crée data.disciplineName
6. Réponds en français sauf si l'utilisateur écrit en anglais

Format de réponse:
{
  "command": "COMMANDE_TYPE",
  "data": { ...données selon la commande },
  "message": "Message motivant pour l'utilisateur (1-2 phrases max)"
}

Exemples:
- "ajoute une séance de handstand demain à 10h"
→ {"command":"CREATE_EVENT","data":{"title":"Séance Handstand","type":"sport","startTime":"demain 10:00","endTime":"demain 11:00","description":"Séance handstand"},"message":"✅ Séance de handstand ajoutée demain à 10h !"}

- "je veux courir 3 fois par semaine"
→ {"command":"SCHEDULE_ROUTINE","data":{"title":"Course à pied","type":"sport","timesPerWeek":3,"duration":30,"description":"Sortie course à pied"},"message":"🏃‍♂️ 3 séances de course programmées cette semaine !"}

- "je veux courir un marathon en 4h"
→ {"command":"CREATE_OBJECTIF","data":{"title":"Marathon en 4h","description":"Préparer et courir un marathon en moins de 4h","deadline":"6 mois","priority":"high","disciplineName":"Sport"},"message":"🎯 Objectif marathon créé ! Je prépare un roadmap détaillé."}

- "je pèse maintenant 80kg"
→ {"command":"UPDATE_PROFIL","data":{"poids":80},"message":"⚖️ Poids mis à jour à 80kg !"}

- "je veux faire du sport"
→ {"command":"GET_SPORT_SUGGESTION","data":{"sportType":"running","distanceKm":5,"routeType":"loop"},"message":"🏃‍♂️ Voici une suggestion de course pour toi !"}

- "qu'est-ce que je devrais manger?"
→ {"command":"GET_FOOD_SUGGESTION","data":{"mealType":"balanced","mealTime":"lunch","calories":2000},"message":"🍽️ Voici une suggestion de repas équilibré !"}

- "merci"
→ {"command":"RESPOND","data":{},"message":"Avec plaisir ! 💪"}`;

  async execute(userMessage: string): Promise<string> {
    const { command, data, message } = await this.sendCommand(userMessage);

    // Handle special commands that need additional data (route, food, etc.)
    if (command === 'GET_SPORT_SUGGESTION') {
      const sportData = await this.getSportSuggestion(data);
      return message + '\n\n' + sportData;
    }
    if (command === 'GET_FOOD_SUGGESTION') {
      const foodData = await this.getFoodSuggestion(data);
      return message + '\n\n' + foodData;
    }

    await this.runCommand(command, data);
    return message;
  }

  private async getSportSuggestion(data: Record<string, unknown>): Promise<string> {
    const sportType = (data['sportType'] as string) || 'running';
    const distanceKm = (data['distanceKm'] as number) || 5;
    const routeType = (data['routeType'] as string) || 'loop';

    try {
      const position = await this.sportRoute.getCurrentPosition();
      const route = await this.sportRoute.getRunningRoute(position, distanceKm, routeType as 'out_and_back' | 'loop');
      return this.sportRoute.formatRouteInstructions(route);
    } catch (err) {
      const suggestions = this.sportRoute.getDefaultSuggestions();
      const suggestion = suggestions.find(s => s.type === sportType) || suggestions[0];
      return `🏃‍♂️ ${suggestion.name}\n⏱️ ${suggestion.duration}min | 💪 ${suggestion.intensity}\n${suggestion.description}\n\n⚠️ Impossible d'obtenir un itinéraire (géolocalisation indisponible)`;
    }
  }

  private async getFoodSuggestion(data: Record<string, unknown>): Promise<string> {
    const mealType = (data['mealType'] as string) || 'balanced';
    const calories = (data['calories'] as number) || 2000;

    // Generate meal suggestions based on type
    const meals: Record<string, { name: string; foods: string[]; calories: number }[]> = {
      breakfast: [
        { name: 'Petit-déjeuner protéiné', foods: ['🥚 3 œufs brouillés', '🍞 2 tranches pain complet', '🥛 1 verre lait', '🍌 1 banane'], calories: 450 },
        { name: 'Porridge能量', foods: ['🥣 100g flocons avoine', '🥛 250ml lait', '🍯 1 c.à.s miel', '🫐 50g myrtilles'], calories: 400 },
      ],
      lunch: [
        { name: 'Salade composée', foods: ['🥗 200g salade verte', '🍗 150g poulet grillé', '🥕 100g carrots rapées', '🫘 50g pois chiches', '🌻 1 c.à.s huile olive'], calories: 550 },
        { name: 'Bowl riz poisson', foods: ['🍚 200g riz basmati', '🐟 150g poisson blanc', '🥦 100g broccoli', '🥑 50g avocat'], calories: 580 },
      ],
      dinner: [
        { name: 'Dîner léger protéiné', foods: ['🍗 200g poulet rôti', '🥔 150g patate douce', '🥦 100g choux fleur', '🥗 salad'], calories: 500 },
        { name: 'Poisson + légumes', foods: ['🐟 200g poisson gras', '🥕 200g légumes variés', '🍚 100g riz'], calories: 520 },
      ],
      snack: [
        { name: 'En-cas protéiné', foods: ['🥜 30g noix混合', '🧀 1 fromage blanc 0%'], calories: 180 },
        { name: 'Fruit + oléagineux', foods: ['🍎 1 pomme', '🥜 20g amandes'], calories: 150 },
      ],
    };

    const type = (data['mealTime'] as string) || 'lunch';
    const typeMeals = meals[type] || meals['lunch'];
    const meal = typeMeals[Math.floor(Math.random() * typeMeals.length)];

    let text = `🍽️ **${meal.name}** (~${meal.calories} kcal)\n\n`;
    for (const food of meal.foods) {
      text += `${food}\n`;
    }
    text += `\n💡 Objectif: ~${calories} kcal/jour`;

    // Create shopping event for ingredients
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    await this.evenements.create({
      title: 'Courses: ' + meal.name,
      description: meal.foods.join(', '),
      type: 'food',
      startTime: `${dateStr}T10:00:00`,
      endTime: `${dateStr}T11:00:00`,
      allDay: false,
      color: '#2ecc71',
    });

    return text + '\n\n✅ Événement "Courses" ajouté pour demain !';
  }

  private async sendCommand(message: string): Promise<GrokCommand> {
    return new Promise((resolve) => {
      this.grok.sendMessage([{ role: 'user', content: message }]).subscribe({
        next: (reply) => {
          try {
            // Extract JSON from response (in case there's extra text)
            const jsonMatch = reply.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]) as GrokCommand;
              if (parsed.command && parsed.message) {
                resolve(parsed);
                return;
              }
            }
            // Fallback: treat as a regular response
            resolve({ command: 'RESPOND', data: { text: reply }, message: reply });
          } catch {
            resolve({ command: 'RESPOND', data: { text: reply }, message: reply });
          }
        },
        error: () => {
          resolve({ command: 'RESPOND', data: {}, message: 'Erreur de connexion à Grok. Réessaie.' });
        },
      });
    });
  }

  private async runCommand(command: string, data: Record<string, unknown>): Promise<void> {
    switch (command) {
      case 'CREATE_EVENT':
        await this.createEvent(data);
        break;
      case 'UPDATE_EVENT':
        await this.updateEvent(data);
        break;
      case 'DELETE_EVENT':
        await this.deleteEvent(data);
        break;
      case 'CREATE_OBJECTIF':
        await this.createObjectif(data);
        break;
      case 'UPDATE_OBJECTIF':
        await this.updateObjectif(data);
        break;
      case 'COMPLETE_OBJECTIF':
        await this.completeObjectif(data);
        break;
      case 'CREATE_DISCIPLINE':
        await this.createDiscipline(data);
        break;
      case 'UPDATE_PROFIL':
        await this.updateProfil(data);
        break;
      case 'SCHEDULE_ROUTINE':
        await this.scheduleRoutine(data);
        break;
      case 'RESPOND':
      default:
        // No action needed
        break;
    }
  }

  private parseTime(timeStr: string): { date: string; hour: string; minute: string } {
    const now = new Date();
    const lower = timeStr.toLowerCase().trim();

    // Check for "demain" keyword (possibly with time after)
    if (lower.startsWith('demain')) {
      now.setDate(now.getDate() + 1);
      const timePart = lower.replace('demain', '').trim();
      if (timePart) {
        const parsed = this.parseTimePart(timePart, now);
        return parsed;
      }
      return { date: now.toISOString().split('T')[0], hour: '09', minute: '00' };
    }

    // Check for "aujourdhui" or "maintenant"
    if (lower === 'aujourdhui' || lower === 'maintenant') {
      return {
        date: now.toISOString().split('T')[0],
        hour: String(now.getHours()).padStart(2, '0'),
        minute: String(now.getMinutes()).padStart(2, '0'),
      };
    }

    // Just a time part — use today's date
    const parsed = this.parseTimePart(lower, now);
    return parsed;
  }

  private parseTimePart(timePart: string, baseDate: Date): { date: string; hour: string; minute: string } {
    // Parse "HH:mm" or "HHh" or "HH:00"
    const timeMatch = timePart.match(/(\d{1,2})[:h]?(\d{0,2})/);
    if (timeMatch) {
      const hour = timeMatch[1].padStart(2, '0');
      const minute = (timeMatch[2] || '00').padStart(2, '0');
      return { date: baseDate.toISOString().split('T')[0], hour, minute };
    }
    return { date: baseDate.toISOString().split('T')[0], hour: '09', minute: '00' };
  }

  private parseToISO(date: string, hour: string, minute: string): string {
    return `${date}T${hour}:${minute}:00`;
  }

  private getDayOfWeek(dateStr: string): number {
    return new Date(dateStr).getDay(); // 0=Sun, 1=Mon, ...
  }

  private getNextDateByDay(baseDate: Date, targetDay: number): Date {
    const d = new Date(baseDate);
    const current = d.getDay();
    const diff = (targetDay - current + 7) % 7 || 7;
    d.setDate(d.getDate() + diff);
    return d;
  }

  private async createEvent(data: Record<string, unknown>): Promise<void> {
    const timeInfo = this.parseTime((data['startTime'] as string) || 'aujourdhui');
    const endTimeInfo = this.parseTime((data['endTime'] as string) || timeInfo.hour + ':59');
    const duration = (data['duration'] as number) || 60;

    const startISO = this.parseToISO(timeInfo.date, timeInfo.hour, timeInfo.minute);
    const startDate = new Date(startISO);
    const endDate = new Date(startDate.getTime() + duration * 60000);
    const endISO = endDate.toISOString().slice(0, 16);

    const typeMap: Record<string, EvenementType> = {
      sport: 'sport', sport_: 'sport', running: 'sport', course: 'sport', musculation: 'sport', handstand: 'sport',
      sleep: 'sleep', sommeil: 'sleep',
      food: 'food', alimentation: 'food', repas: 'food', courses: 'food',
      work: 'work', travail: 'work', taf: 'work',
      travel: 'travel', trajet: 'travel',
      study: 'study', lecture: 'study', code: 'study', revision: 'study',
      health: 'health', santé: 'health',
    };
    const type = typeMap[(data['type'] as string) || 'other'] || 'other';

    const colorMap: Record<string, string> = {
      sport: '#e74c3c', sleep: '#9b59b6', food: '#2ecc71', work: '#3498db',
      travel: '#f39c12', study: '#1abc9c', health: '#e91e63', other: '#95a5a6',
    };

    await this.evenements.create({
      title: (data['title'] as string) || 'Événement',
      description: (data['description'] as string) || '',
      type,
      startTime: startISO,
      endTime: endISO,
      allDay: false,
      color: (data['color'] as string) || colorMap[type] || '#95a5a6',
    });
  }

  private async updateEvent(data: Record<string, unknown>): Promise<void> {
    const id = data['id'] as string;
    if (!id) return;
    const changes: Record<string, unknown> = {};
    if (data['title']) changes['title'] = data['title'];
    if (data['description']) changes['description'] = data['description'];
    if (data['startTime']) {
      const timeInfo = this.parseTime(data['startTime'] as string);
      changes['start_time'] = this.parseToISO(timeInfo.date, timeInfo.hour, timeInfo.minute);
    }
    if (data['endTime']) {
      const timeInfo = this.parseTime(data['endTime'] as string);
      changes['end_time'] = this.parseToISO(timeInfo.date, timeInfo.hour, timeInfo.minute);
    }
    await this.evenements.update(id, changes as any);
  }

  private async deleteEvent(data: Record<string, unknown>): Promise<void> {
    const id = data['id'] as string;
    if (!id) return;
    await this.evenements.delete(id);
  }

  private async createObjectif(data: Record<string, unknown>): Promise<void> {
    const title = (data['title'] as string) || 'Nouvel objectif';
    const deadlineStr = data['deadline'] as string;
    let deadline: string | undefined;
    if (deadlineStr) {
      const now = new Date();
      const months = deadlineStr.match(/(\d+)\s*mois?/);
      if (months) {
        now.setMonth(now.getMonth() + parseInt(months[1]));
        deadline = now.toISOString();
      } else {
        deadline = new Date(deadlineStr).toISOString();
      }
    }
    await this.objectifs.create({
      title,
      description: (data['description'] as string) || '',
      status: 'pending',
      priority: (data['priority'] as ObjectifPriority) || 'medium',
      progress: 0,
      deadline,
    });
  }

  private async updateObjectif(data: Record<string, unknown>): Promise<void> {
    const id = data['id'] as string;
    if (!id) return;
    const changes: Record<string, unknown> = {};
    if (data['title']) changes['title'] = data['title'];
    if (data['description']) changes['description'] = data['description'];
    if (data['progress'] !== undefined) changes['progress'] = data['progress'];
    if (data['status']) changes['status'] = data['status'];
    if (data['deadline']) changes['deadline'] = new Date(data['deadline'] as string).toISOString();
    await this.objectifs.update(id, changes as any);
  }

  private async completeObjectif(data: Record<string, unknown>): Promise<void> {
    const id = data['id'] as string;
    if (!id) return;
    await this.objectifs.complete(id);
  }

  private async createDiscipline(data: Record<string, unknown>): Promise<void> {
    await this.disciplines.create({
      name: (data['name'] as string) || 'Nouvelle discipline',
      type: (data['type'] as DisciplineType) || 'other',
      icon: (data['icon'] as string) || '🎯',
      color: (data['color'] as string) || '#3498db',
      xp: 0,
      level: 1,
    });
  }

  private async updateProfil(data: Record<string, unknown>): Promise<void> {
    const changes: Record<string, unknown> = {};
    if (data['poids'] !== undefined) changes['poids'] = data['poids'];
    if (data['nom']) changes['nom'] = data['nom'];
    if (data['prenom']) changes['prenom'] = data['prenom'];
    if (data['age']) changes['age'] = data['age'];
    if (data['adresse']) changes['adresse'] = data['adresse'];
    if (data['taf']) changes['taf'] = data['taf'];
    if (Object.keys(changes).length > 0) {
      await this.profil.update(changes as any);
    }
  }

  private async scheduleRoutine(data: Record<string, unknown>): Promise<void> {
    const timesPerWeek = (data['timesPerWeek'] as number) || 3;
    const title = (data['title'] as string) || 'Séance';
    const type = (data['type'] as string) || 'sport';
    const duration = (data['duration'] as number) || 60;
    const description = (data['description'] as string) || '';

    // Default days spread across the week
    const defaultDays = [1, 3, 5]; // Mon, Wed, Fri
    const days = defaultDays.slice(0, timesPerWeek);

    const colorMap: Record<string, string> = {
      sport: '#e74c3c', sleep: '#9b59b6', food: '#2ecc71', work: '#3498db',
      travel: '#f39c12', study: '#1abc9c', health: '#e91e63', other: '#95a5a6',
    };

    const now = new Date();
    for (const day of days) {
      const targetDate = this.getNextDateByDay(now, day);
      const dateStr = targetDate.toISOString().split('T')[0];
      const startISO = `${dateStr}T09:00:00`;
      const endDate = new Date(targetDate.getTime() + duration * 60000);
      const endISO = endDate.toISOString().slice(0, 16);

      await this.evenements.create({
        title,
        description,
        type: type as EvenementType,
        startTime: startISO,
        endTime: endISO,
        allDay: false,
        color: colorMap[type] || '#95a5a6',
      });
    }
  }
}

import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { IgrackеService } from '../../services/igracke';
import { KorpaService } from '../../services/korpa';
import { Igracka } from '../../models/igracka.model';

interface Poruka {
  tekst: string;
  odKoga: 'korisnik' | 'agent';
}

@Component({
  selector: 'app-agent',
  standalone: true,
  imports: [
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, FormsModule
  ],
  templateUrl: './agent.html',
  styleUrl: './agent.css'
})
export class Agent {
  otvoren = false;
  poruke: Poruka[] = [];
  unos = '';
  igracke: Igracka[] = [];

  constructor(
    private igrackеService: IgrackеService,
    private korpaService: KorpaService
  ) {
    this.igrackеService.igracke$.subscribe(data => {
      if (data.length > 0) this.igracke = data;
    });
    this.dodajPoruku('agent', '👋 Zdravo! Ja sam Igor, vaš asistent. Mogu da vam pomognem da pronađete igračke. Probajte: "pokaži slagalice", "igračke za devojčice", "najjeftinije igračke"');
  }

  toggleAgent() {
    this.otvoren = !this.otvoren;
  }

  dodajPoruku(odKoga: 'korisnik' | 'agent', tekst: string) {
    this.poruke.push({ tekst, odKoga });
  }

  posalji() {
    const tekst = this.unos.trim();
    if (!tekst) return;

    this.dodajPoruku('korisnik', tekst);
    this.unos = '';

    setTimeout(() => {
      const odgovor = this.generisiOdgovor(tekst.toLowerCase());
      this.dodajPoruku('agent', odgovor);
    }, 500);
  }

  generisiOdgovor(tekst: string): string {
    // Pozdrav
    if (tekst.includes('zdravo') || tekst.includes('cao') || tekst.includes('bok')) {
      return '👋 Zdravo! Kako mogu da vam pomognem?';
    }

    // Pretraga po tipu
    if (tekst.includes('slagalica') || tekst.includes('slagalice')) {
      return this.prikaziIgrackePoTipu('Slagalica');
    }
    if (tekst.includes('slikovnica') || tekst.includes('slikovnice')) {
      return this.prikaziIgrackePoTipu('Slikovnica');
    }
    if (tekst.includes('figura') || tekst.includes('figure')) {
      return this.prikaziIgrackePoTipu('Figura');
    }
    if (tekst.includes('vozilo') || tekst.includes('vozila') || tekst.includes('auto') || tekst.includes('kamion')) {
      return this.prikaziIgrackePoTipu('Vozilo');
    }
    if (tekst.includes('plisana') || tekst.includes('plišana') || tekst.includes('mekana')) {
      return this.prikaziIgrackePoTipu('Plišana igračka');
    }
    if (tekst.includes('drustvena') || tekst.includes('društvena')) {
      return this.prikaziIgrackePoTipu('Društvena igra');
    }
    if (tekst.includes('edukativ') || tekst.includes('edukacij')) {
      return this.prikaziIgrackePoTipu('Edukativna igračka');
    }
    if (tekst.includes('muzick') || tekst.includes('muzičk')) {
      return this.prikaziIgrackePoTipu('Muzička igračka');
    }
    if (tekst.includes('konstruktor')) {
      return this.prikaziIgrackePoTipu('Konstruktorski set');
    }
    if (tekst.includes('kreativni') || tekst.includes('kreativan')) {
      return this.prikaziIgrackePoTipu('Kreativni set');
    }

    // Pretraga po ciljnoj grupi
    if (tekst.includes('devojcic') || tekst.includes('devojčic')) {
      return this.prikaziIgrackePoGrupi('devojčica');
    }
    if (tekst.includes('decak') || tekst.includes('dečak')) {
      return this.prikaziIgrackePoGrupi('dečak');
    }
    if (tekst.includes('svi') || tekst.includes('svima') || tekst.includes('sva deca')) {
      return this.prikaziIgrackePoGrupi('svi');
    }

    // Pretraga po uzrastu
    if (tekst.includes('beba') || tekst.includes('bebe') || tekst.includes('0-2')) {
      return this.prikaziIgrackePoUzrastu('0-2');
    }
    if (tekst.includes('3-5') || tekst.includes('predskolci') || tekst.includes('predškolci')) {
      return this.prikaziIgrackePoUzrastu('3-5');
    }
    if (tekst.includes('6-9') || tekst.includes('skolski') || tekst.includes('školski')) {
      return this.prikaziIgrackePoUzrastu('6-9');
    }
    if (tekst.includes('10+') || tekst.includes('tinejdzer') || tekst.includes('tinejdžer')) {
      return this.prikaziIgrackePoUzrastu('10+');
    }

    // Najjeftinije
    if (tekst.includes('jeftin') || tekst.includes('najjeftin')) {
      const sortirane = [...this.igracke].sort((a, b) => a.price - b.price).slice(0, 5);
      return '💰 Najjeftinije igračke:\n' + sortirane.map(i =>
        `• ${i.name} — ${i.price} RSD`).join('\n');
    }

    // Najskuplje
    if (tekst.includes('skupl') || tekst.includes('najskuplj')) {
      const sortirane = [...this.igracke].sort((a, b) => b.price - a.price).slice(0, 5);
      return '💎 Najskuplje igračke:\n' + sortirane.map(i =>
        `• ${i.name} — ${i.price} RSD`).join('\n');
    }

    // Pretraga po nazivu
    const nadjena = this.igracke.filter(i =>
      i.name.toLowerCase().includes(tekst)
    );
    if (nadjena.length > 0) {
      return '🔍 Pronašao sam:\n' + nadjena.map(i =>
        `• ${i.name} — ${i.price} RSD (${i.type.name})`).join('\n');
    }

    // Default
    return '🤔 Nisam razumeo. Probajte: "slagalice", "igračke za dečake", "najjeftinije", "vozila", "edukativne"';
  }

  prikaziIgrackePoTipu(tip: string): string {
    const rezultat = this.igracke.filter(i =>
      i.type.name.toLowerCase() === tip.toLowerCase()
    );
    if (rezultat.length === 0) return `Nema igračaka tipa "${tip}".`;
    return `🧸 ${tip}:\n` + rezultat.map(i =>
      `• ${i.name} — ${i.price} RSD`).join('\n');
  }

  prikaziIgrackePoGrupi(grupa: string): string {
    const rezultat = this.igracke.filter(i =>
      i.targetGroup.toLowerCase() === grupa.toLowerCase()
    );
    if (rezultat.length === 0) return `Nema igračaka za "${grupa}".`;
    return `🧸 Igračke za ${grupa}:\n` + rezultat.map(i =>
      `• ${i.name} — ${i.price} RSD`).join('\n');
  }

  prikaziIgrackePoUzrastu(uzrast: string): string {
    const rezultat = this.igracke.filter(i =>
      i.ageGroup.name.toLowerCase() === uzrast.toLowerCase()
    );
    if (rezultat.length === 0) return `Nema igračaka za uzrast "${uzrast}".`;
    return `👶 Uzrast ${uzrast}:\n` + rezultat.map(i =>
      `• ${i.name} — ${i.price} RSD`).join('\n');
  }
}
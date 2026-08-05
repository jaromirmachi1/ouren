import type { Customer, CustomerStatus } from './types'

type SeedClient = {
  name: string
  email?: string
  phone?: string
  group: 'etapa2' | 'databaze' | 'kupujici'
}

const etapa2: SeedClient[] = [
  { name: 'Jan Andrýsek', email: 'jan.andr@seznam.cz', phone: '733 557 768', group: 'etapa2' },
  { name: 'Dominik Barak', email: 'dominic.barac@gmail.com', phone: '778 748 151', group: 'etapa2' },
  { name: 'Hatalová', phone: '601 128 815', group: 'etapa2' },
  { name: 'Alena Jašová', email: 'AL.jasova@seznam.cz', phone: '737 912 597', group: 'etapa2' },
  { name: 'Maria Budzakova', email: 'm.budzakova@azet.sk', phone: '774 892 948', group: 'etapa2' },
  { name: 'Osička', phone: '777 780 887', group: 'etapa2' },
  { name: 'Ing. Jiří Svoboda', email: 'jsvobo77@gmail.com', phone: '606 712 290', group: 'etapa2' },
  { name: 'Iva Vodičková', phone: '607 929 355', group: 'etapa2' },
  { name: 'Jitka Vujtova', email: 'jitka@vujta.cz', phone: '602 779 107', group: 'etapa2' },
  { name: 'Dana Veškrnová', email: 'veda@1email.cz', phone: '737 814 338', group: 'etapa2' },
]

const databaze: SeedClient[] = [
  { name: 'MUDr. Eva Bayerova', email: 'eva.bayerova@gmail.com', phone: '777 594 257', group: 'databaze' },
  { name: 'Alena Černá', email: 'cernaalena21@seznam.cz', phone: '739 534 719', group: 'databaze' },
  { name: 'Kateřina Fendrichová', email: 'k.kvizova@email.cz', phone: '774 925 955', group: 'databaze' },
  { name: 'Nikola Foret', email: 'nikola.foret@iimce.com', phone: '777 810 490', group: 'databaze' },
  { name: 'Ing. Jaroslav Galba', email: 'jgalba@eurotech.cz', phone: '602 781 431', group: 'databaze' },
  { name: 'Lucie Hamříková', email: 'hamrikova.lucie13@gmail.com', phone: '731 865 510', group: 'databaze' },
  { name: 'Harman', email: 'harmanelectronicdesign@gmail.com', phone: '776 121 457', group: 'databaze' },
  { name: 'Nikola Hegyiová', email: 'hegyiovanikola@gmail.com', phone: '+421 918 232 226', group: 'databaze' },
  { name: 'Mgr. Miroslav Ille', email: 'ille.miroslav@gmail.com', phone: '608 622 245', group: 'databaze' },
  { name: 'Lenka Kadlecová', phone: '733 527 845', group: 'databaze' },
  { name: 'Kateřina Kasíková', email: 'katerina.kasikova@centrum.cz', phone: '605 919 603', group: 'databaze' },
  { name: 'Lucie Kobačková', email: 'lubi.kobac@gmail.com', phone: '608 863 176', group: 'databaze' },
  { name: 'Simona Kopecká', email: 'simonahu@email.cz', phone: '737 773 696', group: 'databaze' },
  { name: 'Dominika Kotásková', email: 'dominikahruskova@centrum.cz', phone: '607 962 074', group: 'databaze' },
  { name: 'Marie Krupičková', email: 'krupajda@seznam.cz', phone: '605 071 103', group: 'databaze' },
  { name: 'Radka Kubešová', email: 'lamacovaradka@email.cz', phone: '601 120 450', group: 'databaze' },
  { name: 'Mgr. Rosťa Kukol', email: 'rukuko@centrum.cz', phone: '604 624 456', group: 'databaze' },
  { name: 'Helena Kukolová', email: 'befele@centrum.cz', phone: '604 779 060', group: 'databaze' },
  { name: 'Dana Langerová', email: 'da.langerova@seznam.cz', phone: '732 656 133', group: 'databaze' },
  { name: 'Daniel Mačto', email: 'daniel.macto@gmail.com', phone: '775 166 403', group: 'databaze' },
  { name: 'Jana Maděránková', email: 'jana@filiclinic.cz', phone: '777 901 909', group: 'databaze' },
  { name: 'Kristýna Malušová', email: 'kristina.malusova@seznam.cz', phone: '730 935 041', group: 'databaze' },
  { name: 'Tomáš Mikulič', email: 'tomas.mikulic01@gmail.com', phone: '603 902 669', group: 'databaze' },
  { name: 'Kristýna Mišáková', email: 'kristyna.misakova@seznam.cz', phone: '721 181 824', group: 'databaze' },
  { name: 'Josef Pavlovsky', email: 'jpavlovsky@seznam.cz', phone: '777 279 679', group: 'databaze' },
  { name: 'MVDr. Jitka Pfeirová', email: 'jitka.pfeirova@gmail.com', phone: '734 421 844', group: 'databaze' },
  { name: 'Michal Příkazský', email: 'michal.prikazsky@gmail.com', phone: '604 630 722', group: 'databaze' },
  { name: 'Jan Reiter', email: 'reiter@vojtalsro.cz', phone: '721 933 053', group: 'databaze' },
  { name: 'Jiří Rusek', email: 'dalamana@email.cz', phone: '737 507 930', group: 'databaze' },
  { name: 'Říhová', email: 'rozaristore@gmail.com', phone: '736 205 467', group: 'databaze' },
  { name: 'Jana Skotalová', email: 'jana.skotalova@email.cz', phone: '604 236 430', group: 'databaze' },
  { name: 'Tereza Stloukalová', email: 'tereza.stloukalova7@gmail.com', phone: '775 979 366', group: 'databaze' },
  { name: 'Adéla Šauerová', email: 'adela.sauerova@gmail.com', phone: '775 738 191', group: 'databaze' },
  { name: 'Danuše Štelcová', email: 'stelcova@seznam.cz', phone: '704 402 131', group: 'databaze' },
  { name: 'MUDr. Magdalena Šubrtová', email: 'magdaasubrtova@gmail.com', phone: '732 616 198', group: 'databaze' },
  { name: 'Dominik Šváb', email: 'dominiksvab7@gmail.com', phone: '777 661 719', group: 'databaze' },
  { name: 'Jiřina Trampitsch Kovářová', email: 'kovarovajir@gmail.com', phone: '792 769 610', group: 'databaze' },
  { name: 'Libuše Vacová', email: 'libuska.vaccova@gmail.com', phone: '608 035 474', group: 'databaze' },
  { name: 'Leoš Vaculík', email: 'leo.va@seznam.cz', phone: '777 816 811', group: 'databaze' },
  { name: 'Vlach', email: 'n.mail@volny.cz', phone: '605 537 712', group: 'databaze' },
  { name: 'Petra Sadilová', email: 'sadi@sadi.cz', phone: '602 848 407', group: 'databaze' },
  { name: 'Pavla Vráželová', email: 'vrazelova.pavla@gmail.com', phone: '775 505 166', group: 'databaze' },
  { name: 'Ing. Pavel Zbožek', email: 'pavel.zbozek@email.cz', phone: '722 198 134', group: 'databaze' },
  { name: 'Tereza Zemanová', email: 'tereza.zemanova33@gmail.com', phone: '725 102 595', group: 'databaze' },
  { name: 'Veronika Martinková', email: 'veronikamartinkova@post.cz', group: 'databaze' },
  { name: 'Jaromír Vašíček', email: 'mail.vasa@tiscali.cz', group: 'databaze' },
  { name: 'Bc. Michal Sazeček', email: 'petr.sazecek@atlas.cz', phone: '602 812 047', group: 'databaze' },
  { name: 'Jana Polášková', email: 'polaskova.jana25@gmail.com', phone: '725 490 295', group: 'databaze' },
  { name: 'Dana Veškrnová', email: 'veda1@email.cz', phone: '737 814 338', group: 'databaze' },
  { name: 'Gabriela Dvořáková', email: 'dandy.d@seznam.cz', phone: '604 642 592', group: 'databaze' },
  { name: 'Adéla Osladilová', email: 'adaosladilova@icloud.com', phone: '737 567 576', group: 'databaze' },
  { name: 'Dita Bechová', email: 'dita.b@volny.cz', phone: '602 352 408', group: 'databaze' },
  { name: 'MUDr. Sabina Winterová', email: 'Sabina.hruzova@seznam.cz', phone: '608 434 599', group: 'databaze' },
  { name: 'Ing. Ludmila Krchňavá', email: 'ludmila.krchnava@porr.cz', phone: '602 605 343', group: 'databaze' },
  { name: 'Martin Ševčík', email: 'vysocany20@yahoo.com', phone: '777 633 701', group: 'databaze' },
  { name: 'Ing. Marek Rudický', email: 'marek.rudicky@kpc.cz', phone: '725 572 622', group: 'databaze' },
  { name: 'Jan Toul', email: 'jtoul@tiscali.cz', group: 'databaze' },
  { name: 'Petra Vašková', email: 'petra-bou@email.cz', phone: '776 090 152', group: 'databaze' },
  { name: 'Daniel Hons', email: 'info@danhons.cz', group: 'databaze' },
  { name: 'Aleš Hajzler', email: 'ales.hajzler@email.cz', phone: '605 170 644', group: 'databaze' },
  { name: 'Ing. Denisa Provazníková', email: 'provaznikovadenisa@gmail.com', phone: '721 573 424', group: 'databaze' },
  { name: 'Vladimír Kuzma', email: 'vladino.kuzma@gmail.com', phone: '+421 903 258 361', group: 'databaze' },
  { name: 'Daša Kušniráková', email: 'dasa.kus@gmail.com', phone: '730 244 340', group: 'databaze' },
  { name: 'Břetislav Ptáček', email: 'brptacek91@gmail.com', phone: '732 204 401', group: 'databaze' },
  { name: 'Lucie Božoňová', email: 'bozonova.lucie@gmail.com', group: 'databaze' },
  { name: 'Eva Vlkovská', email: 'vlkovska@seznam.cz', group: 'databaze' },
]

const kupujici: SeedClient[] = [
  { name: 'Michaela Bláhová', email: 'michaelablahova@centrum.cz', phone: '606 294 779', group: 'kupujici' },
  { name: 'Pavel Brach', email: 'brach@seznam.cz', phone: '702 212 088', group: 'kupujici' },
  { name: 'Kateřina Marečková', email: 'mareckova2@seznam.cz', phone: '777 332 339', group: 'kupujici' },
  { name: 'David Janeček', email: 'janecek.dave@seznam.cz', phone: '724 857 850', group: 'kupujici' },
  { name: 'Ing. Petr Kodýtek', email: 'p.kodytek@email.cz', phone: '777 158 620', group: 'kupujici' },
]

const groupMeta: Record<
  SeedClient['group'],
  { status: CustomerStatus; source: string; notes: string }
> = {
  etapa2: {
    status: 'qualified',
    source: 'Panorama Žabiny — 2. etapa',
    notes: '2. etapa Panorama Žabiny',
  },
  databaze: {
    status: 'lead',
    source: 'Panorama Žabiny — databáze',
    notes: 'Databáze klientů Panorama Žabiny',
  },
  kupujici: {
    status: 'contract',
    source: 'Panorama Žabiny — kupující',
    notes: 'Kupující Panorama Žabiny',
  },
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const panoramaClientsSeed: SeedClient[] = [...etapa2, ...databaze, ...kupujici]

export const panoramaCustomers: Customer[] = panoramaClientsSeed.map((client, index) => {
  const meta = groupMeta[client.group]
  return {
    _id: `cust-${String(index + 1).padStart(3, '0')}-${slugify(client.name)}`,
    name: client.name,
    email: client.email?.trim() || '',
    phone: client.phone?.trim() || undefined,
    status: meta.status,
    preferredLanguage: 'cs',
    source: meta.source,
    notes: meta.notes,
    interestedProjects: ['Panorama Žabiny'],
    portalAccess: client.group === 'kupujici',
  }
})

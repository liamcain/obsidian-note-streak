import type { Moment } from "moment";
import { TFile, Plugin } from "obsidian";
import type { ICalendarSource, IDayMetadata } from "obsidian-calendar-ui";
import { getAllDailyNotes, getDailyNote } from "obsidian-daily-notes-interface";

import { classList } from "./utils";

const getStreakClasses = (file: TFile): string[] => {
  return classList({
    "has-note": !!file,
  });
};

export default class NoteStreakPlugin extends Plugin {
  private dailyNotes: Record<string, TFile>;

  async onload(): Promise<void> {
    this.dailyNotes = {};

    this.addSource = this.addSource.bind(this);
    this.reindexDailyNotes = this.reindexDailyNotes.bind(this);
    this.getDailyMetadata = this.getDailyMetadata.bind(this);
    this.getWeeklyMetadata = this.getWeeklyMetadata.bind(this);

    this.registerEvent(this.app.workspace.on("calendar:open", this.addSource));

    if (this.app.workspace.layoutReady) {
      this.reindexDailyNotes();
    } else {
      this.registerEvent(
        this.app.workspace.on("layout-ready", this.reindexDailyNotes)
      );
    }
  }

  addSource(existingSources: ICalendarSource[]): void {
    const streakSource = {
      getDailyMetadata: this.getDailyMetadata,
      getWeeklyMetadata: this.getWeeklyMetadata,
    };
    existingSources.push(streakSource);
  }

  reindexDailyNotes(): void {
    this.dailyNotes = getAllDailyNotes();
  }

  async getDailyMetadata(date: Moment): Promise<IDayMetadata> {
    const file = getDailyNote(date, this.dailyNotes);
    return {
      classes: getStreakClasses(file),
      dots: [],
    };
  }

  async getWeeklyMetadata(_date: Moment): Promise<IDayMetadata> {
    return {};
  }
}

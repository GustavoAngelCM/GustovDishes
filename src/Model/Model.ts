import { v4 as uuid } from "uuid";

/**
 * Parent class that fatprizes generic attributes
 */
export default class Model {
  /** uuid */
  protected id: string;
  /** date attributes */
  protected created_at: number;
  protected updated_at: number;

  setId(id: string): void { this.id = id; }
  setCreatedAt(createdAt: number): void { this.created_at = createdAt; }
  setUpdatedAt(updatedAt: number): void { this.updated_at = updatedAt; }

  getId(): string { return this.id; }
  getCreatedAt(): number { return this.created_at; }
  getUpdatedAt(): number { return this.updated_at; }

  genereteUuid(prefix: string | undefined = undefined): void { this.id = (prefix === undefined) ? uuid() : `${prefix}-${uuid()}` }

  dateNow(): void {
    this.created_at = Date.now();
    this.updated_at = Date.now();
  }
}
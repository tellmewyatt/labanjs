/** A StaffItem represents a note, or a barline or something of this nature */
interface StaffItem {
  startTime: number // Indicating the number of "beats" or "units"
  endTime: number|null
  position: number // Integer representing how many space units from the left this item is
  type: string;
}
interface StaffLine {
  stroke: string // The color of this line
  space: number; // How many units of space this line will add before the next staff line
}
interface Staff {
  items: StaffItem[]
  lines: StaffLine[]
}
interface Score {
  staffs: Record<string,Staff> // A score consists of named staffs
  // Score should automatically stretch into the space of the container it is rendered into
}

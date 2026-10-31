interface DriverState {
  // Epoch ms when the driver last went AVAILABLE; drives the "On Duty" timer.
  onlineSince: number | null;
  socketConnected: boolean;
}

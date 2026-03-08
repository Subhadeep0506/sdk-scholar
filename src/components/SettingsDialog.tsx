import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppSettings } from "@/types/chat";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
};

const models = [
  { value: "gemini-flash", label: "Gemini 3 Flash (Fast)" },
  { value: "gemini-pro", label: "Gemini 2.5 Pro (Powerful)" },
  { value: "gpt-5", label: "GPT-5 (Advanced)" },
  { value: "gpt-5-mini", label: "GPT-5 Mini (Balanced)" },
];

export function SettingsDialog({ open, onOpenChange, settings, onSettingsChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Model</Label>
            <Select
              value={settings.model}
              onValueChange={(model) => onSettingsChange({ ...settings, model })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Temperature</Label>
              <span className="text-sm text-muted-foreground">{settings.temperature.toFixed(1)}</span>
            </div>
            <Slider
              value={[settings.temperature]}
              onValueChange={([temp]) => onSettingsChange({ ...settings, temperature: temp })}
              min={0}
              max={1}
              step={0.1}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Precise</span>
              <span>Creative</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Theme</Label>
            <Select
              value={settings.theme}
              onValueChange={(theme: "light" | "dark") => {
                onSettingsChange({ ...settings, theme });
                document.documentElement.classList.toggle("dark", theme === "dark");
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="light">Light</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

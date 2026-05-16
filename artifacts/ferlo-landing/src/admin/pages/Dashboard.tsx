import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const tiles = [
  {
    to: "/admin/sections",
    title: "Sections",
    description: "Edit every text and image on the public site.",
  },
  {
    to: "/admin/media",
    title: "Media library",
    description: "Upload and manage images used across the site and popups.",
  },
  {
    to: "/admin/popups",
    title: "Popups",
    description:
      "Create modals triggered on page load, after a delay, on exit intent, or on click.",
  },
];

export function Dashboard() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Edit the FerLo marketing site without touching code.
        </p>
      </header>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tiles.map((tile) => (
          <Link key={tile.to} to={tile.to} className="block group">
            <Card className="h-full transition-shadow group-hover:shadow-md">
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">
                  {tile.title}
                </CardTitle>
                <CardDescription>{tile.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-sm font-medium text-primary">
                  Open →
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

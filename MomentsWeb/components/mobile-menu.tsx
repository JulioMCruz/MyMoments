"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"

interface MobileMenuProps {
  variant?: "main" | "dashboard"
}

export default function MobileMenu({ variant = "main" }: MobileMenuProps) {
  const [open, setOpen] = useState(false)

  const links =
    variant === "main"
      ? [
          { href: "/dashboard", label: "Dashboard" },
          { href: "/discover", label: "Discover" },
          { href: "/collection", label: "Collection" },
          // { href: "/create-moment", label: "Create Moment", highlight: true },
        ]
      : [
          { href: "/dashboard", label: "Dashboard" },
          // { href: "/create-moment", label: "Create" },
          { href: "/discover", label: "Discover" },
          { href: "/collection", label: "Collection" },
        ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-white">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] sm:w-[300px] bg-purple-500 text-white border-none">
        <SheetHeader>
          <SheetTitle className="text-white">Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-8">
          {links.map((link) => (
            <SheetClose asChild key={link.href}>
              <Link
                href={link.href}
                className={`py-2 px-4 rounded-md text-lg ${
                  link.highlight ? "bg-white text-purple-500 font-medium" : "hover:bg-purple-400/20"
                }`}
              >
                {link.label}
              </Link>
            </SheetClose>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}


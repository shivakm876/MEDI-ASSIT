"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { LogOut, Search, Settings, User, ChevronDown } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/lib/language-context"

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated } = useAuth()
  const { t } = useLanguage()

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard":
        return t("dashboard")
      case "/symptom-input":
        return t("symptomChecker")
      case "/symptom-history":
        return t("symptomHistory")
      case "/followup-chatbot":
        return t("chat.title")
      case "/book-chatbot":
        return t("nav.predictions")
      case "/appointments":
        return t("appointments")
      case "/medications":
        return t("medications")
      case "/profile":
        return t("profile")
      case "/settings":
        return t("settings")
      case "/results":
        return t("results")
      default:
        return t("app.title")
    }
  }

  // Add keyboard shortcut for search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        {isAuthenticated && <SidebarTrigger className="-ml-1" />}

        {isAuthenticated && (
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold hidden md:block">{getPageTitle()}</h1>
          </div>
        )}

        {!isAuthenticated && (
          <nav className="hidden md:flex items-center gap-6 ml-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              {t("nav.home")}
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              {t("nav.about")}
            </Link>
            <Link href="/blog" className="text-sm font-medium hover:text-primary transition-colors">
              {t("nav.blog")}
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              {t("nav.contact")}
            </Link>
            <Link href="/developer" className="text-sm font-medium hover:text-primary transition-colors">
              {t("nav.developer")}
            </Link>
          </nav>
        )}
      </div>

      {/* Center Section - Search (only for authenticated users) */}
      {isAuthenticated && (
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <Popover open={searchOpen} onOpenChange={setSearchOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={searchOpen}
                className="w-full justify-between text-muted-foreground h-9"
              >
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span className="text-sm">Search pages...</span>
                </div>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="center">
              <Command>
                <CommandInput placeholder="Search pages..." />
                <CommandList>
                  <CommandEmpty>No pages found.</CommandEmpty>
                  <CommandGroup heading="Quick Links">
                    <CommandItem>
                      <Link href="/dashboard" className="flex items-center gap-2 w-full">
                        Dashboard
                      </Link>
                    </CommandItem>
                    <CommandItem>
                      <Link href="/symptom-input" className="flex items-center gap-2 w-full">
                        Symptom Checker
                      </Link>
                    </CommandItem>
                    <CommandItem>
                      <Link href="/symptom-history" className="flex items-center gap-2 w-full">
                        Symptom History
                      </Link>
                    </CommandItem>
                    {/* <CommandItem>
                      <Link href="/appointments" className="flex items-center gap-2 w-full">
                        Appointments
                      </Link>
                    </CommandItem>
                    <CommandItem>
                      <Link href="/medications" className="flex items-center gap-2 w-full">
                        Medications
                      </Link>
                    </CommandItem> */}
                    <CommandItem>
                      <Link href="/profile" className="flex items-center gap-2 w-full">
                        Profile
                      </Link>
                    </CommandItem>
                    <CommandItem>
                      <Link href="/settings" className="flex items-center gap-2 w-full">
                        Settings
                      </Link>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Right Section */}
      <div className="flex items-center gap-2 ml-auto">
        <LanguageSelector />
        <ModeToggle />

        {isAuthenticated ? (
          <>
            {/* Mobile Search */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSearchOpen(true)}>
              <Search className="h-4 w-4" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2 h-9">
                  <Avatar className="h-7 w-7">
                    <AvatarImage
                      src={user?.image || "/placeholder.svg?height=28&width=28"}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:flex flex-col items-start">
                    <span className="text-sm font-medium leading-none">{user?.name || "User"}</span>
                    <span className="text-xs text-muted-foreground leading-none mt-0.5">
                      {user?.email || "user@example.com"}
                    </span>
                  </div>
                  <ChevronDown className="h-3 w-3 hidden lg:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user?.name && <p className="font-medium">{user.name}</p>}
                    {user?.email && <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t("dashboard")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t("profile")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    {t("settings")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t("signOut")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">{t("signIn")}</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">{t("getStarted")}</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}

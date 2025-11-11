"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LayoutDashboard,
  Palette,
  Sparkles,
  Download,
  Check,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  FileText,
  Settings
} from "lucide-react";

export default function PropuestasPage() {
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null);

  const proposals = [
    {
      id: 1,
      name: "Propuesta 1: Elegancia Médica",
      description: "Diseño limpio y profesional con toques de la marca",
      colors: {
        primary: "#0693e3",
        secondary: "#9b51e0",
        accent: "#cf2e2e",
        neutral: "#f8fafc"
      },
      features: [
        "Sidebar con degradado teal-purple",
        "Cards con sombras suaves y bordes redondeados",
        "Iconografía minimalista en color teal",
        "Dashboard con métricas destacadas",
        "Tipografía 'Inter' para interfaz",
      ],
      layout: "sidebar-left"
    },
    {
      id: 2,
      name: "Propuesta 2: Modernidad Vibrante",
      description: "Interfaz moderna con colores audaces de la marca",
      colors: {
        primary: "#9b51e0",
        secondary: "#0693e3",
        accent: "#ff6900",
        neutral: "#ffffff"
      },
      features: [
        "Top navbar con fondo blanco y acentos purple",
        "Sidebar plegable con iconos coloridos",
        "Cards con bordes de colores según categoría",
        "Gráficas con paleta vibrant de la marca",
        "Micro-animaciones en hover",
      ],
      layout: "top-navbar"
    },
    {
      id: 3,
      name: "Propuesta 3: Calidez Minimalista",
      description: "Diseño cálido y acogedor, fiel a 'sonrisas que llegan al alma'",
      colors: {
        primary: "#0693e3",
        secondary: "#ff6900",
        accent: "#9b51e0",
        neutral: "#fef3f2"
      },
      features: [
        "Fondo cálido con overlay de teal suave",
        "Cards flotantes con sombras profundas",
        "Elementos redondeados (border-radius grande)",
        "Paleta más cálida (teal + coral)",
        "Espacios generosos, diseño respirable",
      ],
      layout: "centered-wide"
    }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 print:mb-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 print:text-3xl">
            Propuestas de Layout
          </h1>
          <p className="text-gray-600 mb-4">
            3 diseños inspirados en la identidad visual de CR Dental Studio
          </p>
          <Button onClick={handlePrint} className="print:hidden">
            <Download className="mr-2 h-4 w-4" />
            Descargar como PDF
          </Button>
        </div>

        {/* Brand Colors Reference */}
        <Card className="mb-8 print:break-inside-avoid">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Colores de Marca CR Dental Studio
            </CardTitle>
            <CardDescription>
              Paleta extraída de https://crdentalstudio.com
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-20 rounded-lg" style={{ backgroundColor: "#0693e3" }}></div>
                <p className="text-sm font-medium">Teal Primary</p>
                <p className="text-xs text-gray-500">#0693e3</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg" style={{ backgroundColor: "#9b51e0" }}></div>
                <p className="text-sm font-medium">Purple Secondary</p>
                <p className="text-xs text-gray-500">#9b51e0</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg" style={{ backgroundColor: "#cf2e2e" }}></div>
                <p className="text-sm font-medium">Red Accent</p>
                <p className="text-xs text-gray-500">#cf2e2e</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg" style={{ backgroundColor: "#ff6900" }}></div>
                <p className="text-sm font-medium">Orange Accent</p>
                <p className="text-xs text-gray-500">#ff6900</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Proposals */}
        <div className="space-y-8">
          {proposals.map((proposal) => (
            <Card
              key={proposal.id}
              className="overflow-hidden print:break-inside-avoid"
            >
              <CardHeader
                className="cursor-pointer transition-colors hover:bg-slate-50"
                onClick={() => setSelectedProposal(selectedProposal === proposal.id ? null : proposal.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">
                      {proposal.name}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {proposal.description}
                    </CardDescription>
                  </div>
                  {selectedProposal === proposal.id && (
                    <Check className="h-6 w-6 text-green-600" />
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Color Palette */}
                <div>
                  <h4 className="font-semibold mb-3 text-sm text-gray-700">
                    Paleta de Colores
                  </h4>
                  <div className="flex gap-2">
                    <div
                      className="h-12 flex-1 rounded-lg border border-gray-200"
                      style={{ backgroundColor: proposal.colors.primary }}
                    ></div>
                    <div
                      className="h-12 flex-1 rounded-lg border border-gray-200"
                      style={{ backgroundColor: proposal.colors.secondary }}
                    ></div>
                    <div
                      className="h-12 flex-1 rounded-lg border border-gray-200"
                      style={{ backgroundColor: proposal.colors.accent }}
                    ></div>
                    <div
                      className="h-12 flex-1 rounded-lg border border-gray-200"
                      style={{ backgroundColor: proposal.colors.neutral }}
                    ></div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-semibold mb-3 text-sm text-gray-700">
                    Características Principales
                  </h4>
                  <ul className="space-y-2">
                    {proposal.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Sparkles className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mockup Preview */}
                <div>
                  <h4 className="font-semibold mb-3 text-sm text-gray-700">
                    Vista Previa del Layout
                  </h4>
                  <ProposalMockup proposal={proposal} />
                </div>

                {/* Select Button */}
                <div className="pt-4 print:hidden">
                  <Button
                    onClick={() => setSelectedProposal(proposal.id)}
                    variant={selectedProposal === proposal.id ? "default" : "outline"}
                    className="w-full"
                    style={selectedProposal === proposal.id ? {
                      backgroundColor: proposal.colors.primary,
                      color: 'white'
                    } : undefined}
                  >
                    {selectedProposal === proposal.id ? "Propuesta Seleccionada" : "Seleccionar esta Propuesta"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500 print:mt-8">
          <p>CR Dental Studio - Sistema de Gestión</p>
          <p>Propuestas generadas el {new Date().toLocaleDateString('es-ES')}</p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:break-inside-avoid {
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}

function ProposalMockup({ proposal }: { proposal: any }) {
  const { colors, layout } = proposal;

  if (layout === "sidebar-left") {
    return (
      <div className="border rounded-lg overflow-hidden bg-white h-64">
        <div className="flex h-full">
          {/* Sidebar */}
          <div
            className="w-16 flex flex-col items-center py-4 gap-4"
            style={{
              background: `linear-gradient(180deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
            }}
          >
            <LayoutDashboard className="h-5 w-5 text-white" />
            <Users className="h-5 w-5 text-white/70" />
            <ShoppingCart className="h-5 w-5 text-white/70" />
            <Package className="h-5 w-5 text-white/70" />
          </div>
          {/* Main Content */}
          <div className="flex-1 p-4" style={{ backgroundColor: colors.neutral }}>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="h-12 rounded bg-white border border-gray-200 flex items-center justify-center">
                <DollarSign className="h-4 w-4" style={{ color: colors.primary }} />
              </div>
              <div className="h-12 rounded bg-white border border-gray-200 flex items-center justify-center">
                <Users className="h-4 w-4" style={{ color: colors.secondary }} />
              </div>
              <div className="h-12 rounded bg-white border border-gray-200 flex items-center justify-center">
                <FileText className="h-4 w-4" style={{ color: colors.accent }} />
              </div>
            </div>
            <div className="h-32 rounded bg-white border border-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (layout === "top-navbar") {
    return (
      <div className="border rounded-lg overflow-hidden bg-white h-64">
        {/* Top Navbar */}
        <div className="h-12 bg-white border-b flex items-center px-4 justify-between">
          <div className="flex gap-4">
            <div className="h-6 w-20 rounded" style={{ backgroundColor: colors.primary }}></div>
          </div>
          <Settings className="h-5 w-5" style={{ color: colors.primary }} />
        </div>
        <div className="flex h-[calc(100%-3rem)]">
          {/* Sidebar */}
          <div className="w-16 border-r flex flex-col items-center py-4 gap-3">
            <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '20' }}>
              <LayoutDashboard className="h-4 w-4" style={{ color: colors.primary }} />
            </div>
            <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.secondary + '20' }}>
              <Users className="h-4 w-4" style={{ color: colors.secondary }} />
            </div>
            <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.accent + '20' }}>
              <ShoppingCart className="h-4 w-4" style={{ color: colors.accent }} />
            </div>
          </div>
          {/* Main Content */}
          <div className="flex-1 p-4">
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="h-12 rounded border-2" style={{ borderColor: colors.primary }}></div>
              <div className="h-12 rounded border-2" style={{ borderColor: colors.secondary }}></div>
              <div className="h-12 rounded border-2" style={{ borderColor: colors.accent }}></div>
            </div>
            <div className="h-24 rounded bg-gray-50"></div>
          </div>
        </div>
      </div>
    );
  }

  // centered-wide layout
  return (
    <div
      className="border rounded-lg overflow-hidden h-64 p-4"
      style={{ backgroundColor: colors.neutral }}
    >
      <div className="max-w-5xl mx-auto h-full">
        <div className="grid grid-cols-4 gap-3 mb-3">
          <div className="h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center">
            <DollarSign className="h-5 w-5" style={{ color: colors.primary }} />
          </div>
          <div className="h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center">
            <Users className="h-5 w-5" style={{ color: colors.secondary }} />
          </div>
          <div className="h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center">
            <ShoppingCart className="h-5 w-5" style={{ color: colors.accent }} />
          </div>
          <div className="h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center">
            <Package className="h-5 w-5" style={{ color: colors.primary }} />
          </div>
        </div>
        <div className="h-32 rounded-2xl bg-white shadow-lg"></div>
      </div>
    </div>
  );
}

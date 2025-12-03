import { useState, useRef } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Dialog, DialogContent } from "@/components/ui/dialog.tsx";
import { 
  ZoomInIcon, 
  ZoomOutIcon, 
  XIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  MaximizeIcon
} from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  discountBadge?: React.ReactNode;
  stockBadge?: React.ReactNode;
}

export default function ProductImageGallery({
  images,
  productName,
  discountBadge,
  stockBadge,
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !isZoomed) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePosition({ x, y });
  };

  const handleImageClick = () => {
    setLightboxIndex(selectedImage);
    setIsLightboxOpen(true);
  };

  const handlePrevious = () => {
    setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div
          ref={imageRef}
          className="overflow-hidden rounded-3xl shadow-2xl shadow-primary/10 cursor-zoom-in relative group"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          onClick={handleImageClick}
        >
          <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-muted via-background to-accent/10">
            {images[selectedImage] ? (
              <img
                src={images[selectedImage]}
                alt={productName}
                className="object-cover w-full h-full transition-transform duration-300"
                style={
                  isZoomed
                    ? {
                        transform: "scale(2)",
                        transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                      }
                    : {}
                }
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}

            {/* Badges */}
            {discountBadge && <div className="absolute top-4 right-4">{discountBadge}</div>}
            {stockBadge && <div className="absolute top-4 left-4">{stockBadge}</div>}

            {/* Zoom Hint */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black/70 text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2">
                <ZoomInIcon className="h-3 w-3" />
                Hover to zoom
              </div>
            </div>

            {/* Fullscreen Button */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                handleImageClick();
              }}
            >
              <MaximizeIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Thumbnail Images */}
        {images.length > 1 && (
          <div className="grid grid-cols-5 gap-3">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square relative overflow-hidden rounded-lg bg-muted border-3 transition-all hover:scale-105 ${
                  selectedImage === index
                    ? "border-primary ring-2 ring-primary ring-offset-2"
                    : "border-transparent"
                }`}
              >
                <img
                  src={image}
                  alt={`${productName} ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
          <div className="relative w-full h-[95vh] flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
              onClick={() => setIsLightboxOpen(false)}
            >
              <XIcon className="h-6 w-6" />
            </Button>

            {/* Previous Button */}
            {images.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 z-50 text-white hover:bg-white/20 h-12 w-12"
                onClick={handlePrevious}
              >
                <ChevronLeftIcon className="h-8 w-8" />
              </Button>
            )}

            {/* Image */}
            <div className="w-full h-full flex items-center justify-center p-16">
              <img
                src={images[lightboxIndex]}
                alt={`${productName} ${lightboxIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Next Button */}
            {images.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 z-50 text-white hover:bg-white/20 h-12 w-12"
                onClick={handleNext}
              >
                <ChevronRightIcon className="h-8 w-8" />
              </Button>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                {lightboxIndex + 1} / {images.length}
              </div>
            )}

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto px-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setLightboxIndex(index)}
                    className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      lightboxIndex === index
                        ? "border-white scale-110"
                        : "border-white/30 hover:border-white/60"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${productName} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

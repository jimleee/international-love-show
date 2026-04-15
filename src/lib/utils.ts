import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 压缩图片文件，使其大小小于或等于指定大小
 * @param file 原始图片文件
 * @param maxSizeInMB 最大文件大小（MB），默认5MB
 * @param maxWidth 最大宽度（像素），默认2048
 * @param maxHeight 最大高度（像素），默认2048
 * @returns Promise<File> 压缩后的文件
 */
export async function compressImage(
  file: File,
  maxSizeInMB: number = 5,
  maxWidth: number = 2048,
  maxHeight: number = 2048
): Promise<File> {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  // 如果文件已经小于限制，直接返回
  if (file.size <= maxSizeInBytes) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // 计算缩放比例
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }

        // 创建 canvas
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        // 绘制图片
        ctx.drawImage(img, 0, 0, width, height);

        // 使用二分法找到合适的质量值
        const compress = (minQuality: number, maxQuality: number, attempts: number = 0): void => {
          // 防止无限递归
          if (attempts > 20) {
            reject(new Error("Failed to compress image within size limit after multiple attempts"));
            return;
          }

          const quality = Math.round((minQuality + maxQuality) / 2);
          
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Failed to compress image"));
                return;
              }

              // 如果文件大小符合要求
              if (blob.size <= maxSizeInBytes) {
                const compressedFile = new File(
                  [blob],
                  file.name,
                  {
                    type: "image/jpeg",
                    lastModified: Date.now(),
                  }
                );
                resolve(compressedFile);
                return;
              }

              // 如果质量已经降到最低，直接返回（即使还是太大）
              if (quality <= 10 || maxQuality - minQuality <= 1) {
                const compressedFile = new File(
                  [blob],
                  file.name,
                  {
                    type: "image/jpeg",
                    lastModified: Date.now(),
                  }
                );
                resolve(compressedFile);
                return;
              }

              // 继续降低质量
              compress(minQuality, quality, attempts + 1);
            },
            "image/jpeg",
            quality / 100
          );
        };

        // 从质量85开始压缩
        compress(10, 85);
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
}

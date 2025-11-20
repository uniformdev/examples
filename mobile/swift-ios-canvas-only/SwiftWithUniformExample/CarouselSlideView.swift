//
//  CarouselSlideView.swift
//  SwiftWithUniformExample
//
//  Created by uniform on 06-11-2025.
//

import SwiftUI

struct CarouselSlideView: View {
    let slide: CarouselSlideViewModel
    
    var body: some View {
        ZStack {
            // Background color
            colorFromHex(slide.backgroundColor)
                .ignoresSafeArea()
            
            VStack(spacing: 20) {
                Spacer()
                
                // Icon (if available)
                if let imageName = slide.imageName {
                    Image(systemName: imageName)
                        .font(.system(size: 60))
                        .foregroundColor(colorFromHex(slide.titleColor))
                }
                
                // Title
                Text(slide.title)
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(colorFromHex(slide.titleColor))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)
                
                // Description
                Text(slide.description)
                    .font(.body)
                    .foregroundColor(colorFromHex(slide.descriptionColor))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)
                
                // CTA Button
                Button(action: {
                    if let url = URL(string: slide.ctaUrl) {
                        UIApplication.shared.open(url)
                    }
                }) {
                    Text(slide.ctaText)
                        .font(.headline)
                        .foregroundColor(colorFromHex(slide.ctaTextColor))
                        .padding(.horizontal, 30)
                        .padding(.vertical, 15)
                        .background(colorFromHex(slide.ctaBackgroundColor))
                        .cornerRadius(10)
                }
                .padding(.top, 10)
                
                Spacer()
            }
            .padding()
        }
    }
    
    private func colorFromHex(_ hex: String) -> Color {
        let hex = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        guard hex.count == 6,
              let int = UInt64(hex, radix: 16) else {
            return .black
        }
        return Color(
            .sRGB,
            red: Double((int >> 16) & 0xFF) / 255,
            green: Double((int >> 8) & 0xFF) / 255,
            blue: Double(int & 0xFF) / 255,
            opacity: 1.0
        )
    }
}


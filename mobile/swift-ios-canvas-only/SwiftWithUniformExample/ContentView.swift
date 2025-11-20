//
//  ContentView.swift
//  SwiftWithUniformExample
//
//  Created by uniform on 06-11-2025.
//

import SwiftUI

struct ContentView: View {
    @StateObject private var uniformService = UniformService()
    
    var body: some View {
        ZStack {
            if uniformService.isLoading {
                ProgressView("Loading...")
            } else if let errorMessage = uniformService.errorMessage {
                VStack(spacing: 20) {
                    Image(systemName: "exclamationmark.triangle")
                        .font(.largeTitle)
                        .foregroundColor(.red)
                    Text("Error")
                        .font(.headline)
                    Text(errorMessage)
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .padding()
                    
                    Button("Retry") {
                        Task {
                            await uniformService.fetchComposition()
                        }
                    }
                    .buttonStyle(.borderedProminent)
                }
                .padding()
            } else if uniformService.slides.isEmpty {
                Text("No slides available")
                    .foregroundColor(.secondary)
            } else {
                CarouselView(slides: uniformService.slides)
            }
        }
        .task {
            await uniformService.fetchComposition()
        }
    }
}

#Preview {
    ContentView()
}

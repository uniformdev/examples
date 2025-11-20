//
//  UniformService.swift
//  SwiftWithUniformExample
//
//  Created by uniform on 06-11-2025.
//

import Foundation
import Combine

class UniformService: ObservableObject {
    @Published var slides: [CarouselSlideViewModel] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    func fetchComposition() async {
        await MainActor.run {
            isLoading = true
            errorMessage = nil
        }
        
        guard let url = buildURL() else {
            await MainActor.run {
                isLoading = false
                errorMessage = "Invalid URL"
            }
            return
        }
        
        var request = URLRequest(url: url)
        // This is to ensure that the data is not cachedn inside app's cache. Optional.
        request.cachePolicy = .reloadIgnoringLocalCacheData
        request.httpMethod = "GET"
        request.setValue(UniformConfig.apiKey, forHTTPHeaderField: "x-api-key")
        
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            
            guard let httpResponse = response as? HTTPURLResponse,
                  httpResponse.statusCode == 200 else {
                await MainActor.run {
                    isLoading = false
                    errorMessage = "Failed to fetch data"
                }
                return
            }
            
            let compositionResponse = try JSONDecoder().decode(UniformCompositionResponse.self, from: data)
            
            // Extract slides from the nested structure
            let carouselSlides = compositionResponse.compositionApiResponse.composition.slots.mainContent
                .first(where: { $0.type == "carousel" })?
                .slots?.slides ?? []
            
            let viewModels = carouselSlides.map { CarouselSlideViewModel(from: $0.parameters) }
            
            await MainActor.run {
                self.slides = viewModels
                self.isLoading = false
            }
        } catch {
            await MainActor.run {
                isLoading = false
                errorMessage = "Error: \(error.localizedDescription)"
            }
        }
    }
    
    private func buildURL() -> URL? {
        var components = URLComponents(string: UniformConfig.baseURL)
        components?.queryItems = [
            URLQueryItem(name: "projectId", value: UniformConfig.projectId),
            URLQueryItem(name: "path", value: UniformConfig.path)
        ]
        return components?.url
    }
}


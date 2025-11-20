//
//  UniformModels.swift
//  SwiftWithUniformExample
//
//  Created by uniform on 06-11-2025.
//

import Foundation

// MARK: - API Response Models

struct UniformCompositionResponse: Codable {
    let type: String
    let matchedRoute: String
    let compositionApiResponse: CompositionApiResponse
}

struct CompositionApiResponse: Codable {
    let composition: Composition
}

struct Composition: Codable {
    let slots: Slots
}

struct Slots: Codable {
    let mainContent: [CarouselComponent]
}

struct CarouselComponent: Codable {
    let type: String
    let slots: CarouselSlots?
    let parameters: CarouselParameters?
}

struct CarouselSlots: Codable {
    let slides: [CarouselSlideComponent]
}

struct CarouselSlideComponent: Codable {
    let type: String
    let parameters: CarouselSlideParameters
}

struct CarouselParameters: Codable {
    let title: ParameterValue?
    let backgroundColor: ParameterValue?
}

struct CarouselSlideParameters: Codable {
    let title: ParameterValue
    let description: ParameterValue
    let ctaText: ParameterValue
    let ctaLink: LinkParameterValue
    let backgroundColor: ParameterValue
    let titleColor: ParameterValue
    let descriptionColor: ParameterValue
    let ctaBackgroundColor: ParameterValue
    let ctaTextColor: ParameterValue
    let imageName: ParameterValue?
}

struct ParameterValue: Codable {
    let type: String
    let value: String
}

struct LinkValue: Codable {
    let path: String
    let type: String
}

struct LinkParameterValue: Codable {
    let type: String
    let value: LinkValue
}

// MARK: - View Models

struct CarouselSlideViewModel {
    let title: String
    let description: String
    let ctaText: String
    let ctaUrl: String
    let backgroundColor: String
    let titleColor: String
    let descriptionColor: String
    let ctaBackgroundColor: String
    let ctaTextColor: String
    let imageName: String?
}

extension CarouselSlideViewModel {
    init(from parameters: CarouselSlideParameters) {
        self.title = parameters.title.value
        self.description = parameters.description.value
        self.ctaText = parameters.ctaText.value
        self.ctaUrl = parameters.ctaLink.value.path
        self.backgroundColor = parameters.backgroundColor.value
        self.titleColor = parameters.titleColor.value
        self.descriptionColor = parameters.descriptionColor.value
        self.ctaBackgroundColor = parameters.ctaBackgroundColor.value
        self.ctaTextColor = parameters.ctaTextColor.value
        self.imageName = parameters.imageName?.value
    }
}


//
//  CarouselView.swift
//  SwiftWithUniformExample
//
//  Created by uniform on 06-11-2025.
//

import SwiftUI

struct CarouselView: View {
    let slides: [CarouselSlideViewModel]
    
    var body: some View {
        TabView {
            ForEach(Array(slides.enumerated()), id: \.offset) { index, slide in
                CarouselSlideView(slide: slide)
                    .tag(index)
            }
        }
        .tabViewStyle(.page)
        .indexViewStyle(.page(backgroundDisplayMode: .always))
    }
}

